import {QuestionIcon} from '@chakra-ui/icons'
import {Button, ButtonGroup, HStack, Icon} from '@chakra-ui/react'
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

import {MenuButton} from '../shared/MenuButton/MenuButton'
import {ToolbarContext} from './contexts/toolbar'
import {JaenFrame} from './JaenFrame'
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
        leftIcon={<Icon as={FaEdit} color="brand.500" />}
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
          leftIcon={<Icon as={FaSitemap} color="brand.500" />}
          rightIcon={<Icon as={FaCaretDown} />}
          renderItems={() => {
            return <>PageTree</>
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
      user: {
        username: 'schettn',
        firstName: 'Nico',
        lastName: 'Schett'
      },
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
  children: <CMSView />,
  navigation: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...Basic.args.navigation!
  },
  logo: <QuestionIcon boxSize={6} />
}
