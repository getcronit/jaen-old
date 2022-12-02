import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {AdminShell} from './AdminShell.js'
export default {
  title: 'Templates/AdminShell',
  component: AdminShell,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof AdminShell>

type ComponentProps = React.ComponentProps<typeof AdminShell>

// Create a template for the component
const Template: Story<ComponentProps> = args => <AdminShell {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {
  children: (
    <iframe
      src="https://www.yubo.live"
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  )
}
