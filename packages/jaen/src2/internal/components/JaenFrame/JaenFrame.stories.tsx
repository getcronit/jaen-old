import {QuestionIcon} from '@chakra-ui/icons'
import {Button, ButtonGroup, Container, HStack, Icon} from '@chakra-ui/react'
import {SnekFinderProvider} from '@snek-at/snek-finder'
import {ComponentMeta, Story} from '@storybook/react'
import React, {useContext, useEffect} from 'react'
import {
  FaBook,
  FaCaretDown,
  FaCog,
  FaDownload,
  FaEdit,
  FaGlobe,
  FaHome,
  FaImage,
  FaLifeRing,
  FaPencilAlt,
  FaSignOutAlt,
  FaSitemap,
  FaTrash,
  FaUser,
  FaUsersCog
} from 'react-icons/fa'
import {AdminPageManagerProvider} from '../../context/AdminPageManager/AdminPageManagerProvider.js'
import {PageTree} from '../organisms/index.js'
import {MenuButton} from '../shared/MenuButton/MenuButton.js'
import {ToolbarContext} from './contexts/toolbar.js'
import {JaenFrame} from './JaenFrame.js'
export default {
  title: 'JaenFrame',
  component: JaenFrame,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof JaenFrame>

type ComponentProps = React.ComponentProps<typeof JaenFrame>

// Create a template for the component
const Template: Story<ComponentProps> = args => <JaenFrame {...args} />

const CMSView: React.FC = () => {
  const {setToolbar} = useContext(ToolbarContext)

  const EditButton: React.FC = () => {
    const [isEditing, setIsEditing] = React.useState(false)

    const toggleEditing = () => {
      setIsEditing(!isEditing)
    }

    return (
      <Button
        size="sm"
        variant="outline"
        borderColor={isEditing ? 'icon' : undefined}
        leftIcon={<Icon as={FaEdit} color="icon" />}
        onClick={toggleEditing}>
        {isEditing ? 'Stop editing' : 'Edit'}
      </Button>
    )
  }

  const CmsToolbarComponent: React.FC = () => {
    return (
      <ButtonGroup variant="outline">
        <MenuButton
          variant="outline"
          size="sm"
          leftIcon={<Icon as={FaSitemap} color="icon" />}
          rightIcon={<Icon as={FaCaretDown} />}
          renderItems={() => {
            return <PageTree nodes={[]} isNavigatorMode selectedPath="/" />
          }}>
          Navigate pages
        </MenuButton>
        <EditButton />

        <MenuButton
          variant="outline"
          items={{
            save: {
              icon: FaDownload,
              label: 'Save locally'
            },

            discard: {
              icon: FaTrash,
              label: 'Discard changes',
              divider: true
            },
            publish: {
              icon: FaGlobe,
              label: 'Publish online'
            }
          }}>
          Save
        </MenuButton>
      </ButtonGroup>
    )
  }

  useEffect(() => {
    setToolbar({
      components: [CmsToolbarComponent],
      origin: 'cms'
    })
  }, [])

  return <>CMS</>
}

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {
  children: (
    <iframe
      id="frameiii"
      height="5000px"
      width="100%"
      src="http://snek-docs-git-photonq-jem-at.vercel.app"
    />
  ),
  navigation: {
    app: {
      navigationGroups: {
        you: {
          items: {
            home: {
              icon: FaHome,
              label: 'Home'
            }
          }
        },
        cms: {
          label: 'Jaen CMS',
          items: {
            pages: {
              icon: FaSitemap,
              label: 'Pages',
              onClick: () => {
                console.log('pages')
              }
            },
            media: {
              icon: FaImage,
              label: 'Media',
              onClick: () => {
                console.log('media')
              }
            },
            settings: {
              icon: FaCog,
              label: 'Settings',
              onClick: () => {
                console.log('settings')
              }
            }
          }
        },
        photonq: {
          label: 'PhotonQ',
          items: {
            posts: {
              icon: FaPencilAlt,
              label: 'Posts',
              onClick: () => {
                console.log('posts')
              }
            },
            users: {
              icon: FaUsersCog,
              label: 'Users',
              onClick: () => {
                console.log('users')
              }
            }
          }
        }
      },
      version: '3.0.0',
      logo: (
        <HStack>
          <QuestionIcon boxSize={6} />
          <span>Your Brand</span>
        </HStack>
      )
    },
    user: {
      navigationGroups: {
        you: {
          items: {
            home: {
              icon: FaUser,
              label: 'Your Profile'
            }
          }
        },
        account: {
          items: {
            settings: {
              icon: FaCog,
              label: 'Settings'
            }
          }
        },
        help: {
          items: {
            support: {
              icon: FaLifeRing,
              label: 'Snek Support'
            },
            docs: {
              icon: FaBook,
              label: 'Snek Docs'
            }
          }
        },
        more: {
          items: {
            logout: {
              icon: FaSignOutAlt,
              label: 'Logout'
            }
          }
        }
      }
    },
    addMenu: {
      items: {
        page: {
          icon: FaSitemap,
          label: 'New page'
        },
        media: {
          icon: FaImage,
          label: 'New media',
          divider: true
        },
        post: {
          icon: FaPencilAlt,
          label: 'New post'
        }
      }
    },
    breadcrumbs: {
      links: [
        {
          label: 'Pages',
          onClick: () => {}
        }
      ]
    }
  },
  logo: <QuestionIcon boxSize={6} />
}

export const Pages: Story<ComponentProps> = Template.bind({})

Pages.args = {
  children: (
    <SnekFinderProvider>
      <AdminPageManagerProvider
        onCreate={() => ({
          payload: {},
          type: ''
        })}
        onDelete={() => {}}
        onMove={() => {}}
        onUpdate={() => {}}
        onGet={() => {
          return {
            id: `JaenPage jaen-page-1`,
            slug: 'jaen-page-1',
            parent: null,
            children: [],
            jaenPageMetadata: {
              title: 'Jaen Page 1',
              description: 'Jaen Page 1 description',
              image: 'https://via.placeholder.com/300x200',
              canonical: 'https://jaen.com/jaen-page-1',
              datePublished: '2020-01-01',
              isBlogPost: false
            },
            jaenFields: null,
            chapters: {},
            template: 'BlogPage',
            jaenFiles: [],
            sections: []
          }
        }}
        onNavigate={() => {}}
        pageTree={[]}
        pagePaths={[
          {
            path: '/',
            title: 'Home'
          },
          {
            path: '/blog/',
            title: 'Blog'
          },
          {
            path: '/blog/first-post/',
            title: 'First Post'
          },
          {
            path: '/blog/second-post/',
            title: 'Second Post'
          },
          {
            path: '/blog/third-post/',
            title: 'Third Post'
          },
          {
            path: '/about/',
            title: 'About',
            isLocked: true
          }
        ]}
        templates={[]}
        isTemplatesLoading={false}
        rootPageId="JaenPage jaen-page-1"
        onToggleCreator={() => {}}
        getPageIdFromPath={() => 'JaenPage jaen-page-1'}
        getPathFromPageId={() => null}
        latestAddedPageId={undefined}>
        <Container maxW="8xl" mt="8">
          <CMSView />
        </Container>
      </AdminPageManagerProvider>
    </SnekFinderProvider>
  ),
  navigation: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...Basic.args.navigation!
  },
  logo: <QuestionIcon boxSize={6} />
}
