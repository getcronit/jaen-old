import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {AdminSecondaryToolbar} from './AdminSecondaryToolbar.js'
export default {
  title: 'Components/AdminSecondaryToolbar',
  component: AdminSecondaryToolbar,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof AdminSecondaryToolbar>

type ComponentProps = React.ComponentProps<typeof AdminSecondaryToolbar>

// Create a template for the component
const Template: Story<ComponentProps> = args => (
  <AdminSecondaryToolbar {...args} />
)

export const Basic: Story<ComponentProps> = Template.bind({})
