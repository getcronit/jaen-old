import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {AdminSecondaryToolbar} from '../../components/organisms/index.js'
import {AdminShell} from '../../components/templates/AdminShell/AdminShell.js'
import {CMS} from './CMS.js'
export default {
  title: 'templates/views/CMS',
  component: CMS,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Story => (
      <AdminShell
        contentOffset="var(--chakra-sizes-14) * 2"
        withoutAdminToolbarShadow
        beforeAdminShell={
          <AdminSecondaryToolbar
            isSidebarOpen={false}
            onToggleSidebar={() => {}}
          />
        }>
        <Story />
      </AdminShell>
    )
  ]
} as ComponentMeta<typeof CMS>

type ComponentProps = React.ComponentProps<typeof CMS>

// Create a template for the component
const Template: Story<ComponentProps> = args => <CMS {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
