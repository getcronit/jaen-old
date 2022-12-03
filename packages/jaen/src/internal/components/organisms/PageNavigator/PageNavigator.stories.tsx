import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {AdminPageManagerProvider} from 'src/internal/context/AdminPageManager/AdminPageManagerProvider.js'
import {PageNavigator} from './PageNavigator.js'
export default {
  title: 'Components/PageNavigator',
  component: PageNavigator,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Story => (
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
            id: `JaenPage jaen-page-1}`,
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
        rootPageId="Page /"
        onToggleCreator={() => {}}
        getPageIdFromPath={() => null}
        getPathFromPageId={() => null}
        latestAddedPageId={undefined}>
        <Story />
      </AdminPageManagerProvider>
    )
  ]
} as ComponentMeta<typeof PageNavigator>

type ComponentProps = React.ComponentProps<typeof PageNavigator>

// Create a template for the component
const Template: Story<ComponentProps> = args => <PageNavigator {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
