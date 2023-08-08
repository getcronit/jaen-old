import {
  PageConfig,
  useAuthenticationContext,
  useMediaModal,
  useNotificationsContext,
  useJaenUpdateModalContext
} from '@snek-at/jaen'
import {graphql, SliceComponentProps} from 'gatsby'
import {useMemo} from 'react'
import {
  FaCircle,
  FaCogs,
  FaEdit,
  FaFileDownload,
  FaFileUpload,
  FaGlobe,
  FaImage,
  FaSitemap,
  FaTrash
} from 'react-icons/fa'

import Logo from '../components/Logo'
import {NavigationGroupsProps} from '../components/JaenFrame/components/NavigationGroups'
import JaenFrame from '../components/JaenFrame/JaenFrame'
import {CMSManagement, useCMSManagement} from '../connectors/cms-management'
import {Box, Icon} from '@chakra-ui/react'

type SliceProps = SliceComponentProps<
  {
    allSitePage: {
      nodes: Array<{
        id: string
        path: string
        pageContext: {
          pageConfig: PageConfig
        }
      }>
    }
  },
  {},
  {
    jaenPageId: string
    pageConfig: any
  }
>

const Slice: React.FC<SliceProps> = props => {
  const manager = useCMSManagement()

  const authentication = useAuthenticationContext()
  const mediaModal = useMediaModal()

  const {toast} = useNotificationsContext()

  const jaenUpdate = useJaenUpdateModalContext()

  const isBadgeVisible = manager.isEditing || jaenUpdate.isUpdateAvailable

  const {navigationGroups} = useMemo(() => {
    const sortedNodes = props.data.allSitePage.nodes.sort((a, b) => {
      const aOrder = a.pageContext.pageConfig?.menu?.order || 0
      const bOrder = b.pageContext.pageConfig?.menu?.order || 0
      return aOrder - bOrder
    })

    const navigationGroups: {
      app: NavigationGroupsProps['groups']
      user: NavigationGroupsProps['groups']
    } = {
      app: {},
      user: {
        ...(jaenUpdate.isUpdateAvailable
          ? {
              important: {
                items: {
                  updateAvailable: {
                    label: 'Jaen Update available',
                    icon: () => (
                      <Icon as={FaCogs} color="pink.500" fontSize="lg" mr="2" />
                    ),
                    onClick: () => {
                      jaenUpdate.toggleModal()
                    }
                  }
                }
              }
            }
          : {}),
        add: {
          items: {
            addPage: {
              label: 'New page',
              icon: FaSitemap,
              path: `/cms/pages/new/#${btoa(props.jaenPageId)}`
            },
            addMedia: {
              label: 'New media',
              icon: FaImage,
              onClick: () => {
                mediaModal.toggleModal()
              }
            }
          }
        },
        jaenCms: {
          label: 'Jaen CMS',
          items: {
            edit: {
              label: manager.isEditing ? 'Stop editing' : 'Start editing',
              icon: FaEdit,
              onClick: () => {
                manager.setIsEditing(!manager.isEditing)

                toast({
                  title: 'Edit mode',
                  description: !manager.isEditing
                    ? 'You can now edit the page'
                    : 'You can no longer edit the page',
                  status: !manager.isEditing ? 'success' : 'info'
                })
              }
            },
            save: {
              label: 'Save draft',
              icon: FaFileDownload,
              onClick: () => {
                manager.draft.save()

                toast({
                  title: 'Saved',
                  description: 'Your changes have been saved',
                  status: 'success'
                })
              }
            },
            import: {
              label: 'Import draft',
              icon: FaFileUpload,
              onClick: async () => {
                try {
                  await manager.draft.import()

                  toast({
                    title: 'Imported',
                    description: 'Your changes have been imported',
                    status: 'success'
                  })
                } catch (e) {
                  toast({
                    title: 'Failed to import',
                    description: 'Your changes could not be imported',
                    status: 'error'
                  })
                }
              }
            },
            discard: {
              label: 'Discard changes',
              icon: FaTrash,
              onClick: () => {
                manager.draft.discard()

                toast({
                  title: 'Discarded',
                  description: 'Your changes have been discarded',
                  status: 'info'
                })
              }
            },
            publish: {
              label: `Publish ${
                manager.isPublishing ? 'in progress' : 'changes'
              }`,
              isLoading: manager.isPublishing,
              icon: FaGlobe,
              onClick: () => {
                manager.setIsPublishing(true)

                toast({
                  title: 'Publishing',
                  description: 'Your changes are being published',
                  status: 'info'
                })
              }
            }
          }
        }
      }
    }

    sortedNodes.forEach(node => {
      const config = node.pageContext.pageConfig

      if (!config?.menu) return

      const group = config.menu.group || 'default'

      const groupType = config.menu.type === 'app' ? 'app' : 'user'

      if (!navigationGroups[groupType][group]) {
        navigationGroups[groupType][group] = {
          label: config.menu.groupLabel,
          items: {}
        }
      }

      navigationGroups[groupType]![group]!.items[node.id] = {
        label: config.menu?.label || config.label,
        path: node.path,
        icon: config.icon ? require('react-icons/fa')[config.icon] : undefined
      }
    })

    return {navigationGroups}
  }, [props.data.allSitePage.nodes, manager])

  return (
    <JaenFrame
      navigation={{
        isStickyDisabled: props.pageConfig?.withoutJaenFrameStickyHeader,
        app: {
          navigationGroups: navigationGroups.app,
          // @ts-ignore
          version: __VERSION__,
          logo: <Logo />
        },
        user: {
          user: authentication.user
            ? {
                username: authentication.user?.username,
                firstName: authentication.user.details?.firstName,
                lastName: authentication.user.details?.lastName
              }
            : {
                username: 'Guest'
              },
          navigationGroups: navigationGroups.user,
          isBadgeVisible
        },
        addMenu: {
          items: {
            addPage: {
              label: 'New page',
              icon: FaSitemap,
              path: props.jaenPageId
                ? `/cms/pages/new/#${btoa(props.jaenPageId)}`
                : '/cms/pages/new/'
            },
            addMedia: {
              label: 'New media',
              icon: FaImage,
              onClick: () => {
                mediaModal.toggleModal()
              }
            }
          }
        },
        breadcrumbs: {
          links: props.pageConfig?.breadcrumbs || []
        }
      }}
      logo={<Logo />}
    />
  )
}

const JaenFrameSlice: React.FC<SliceProps> = props => (
  <CMSManagement>
    <Slice {...props} />
  </CMSManagement>
)

export default JaenFrameSlice

export const query = graphql`
  query {
    allSitePage {
      nodes {
        id
        path
        pageContext
      }
    }
  }
`
