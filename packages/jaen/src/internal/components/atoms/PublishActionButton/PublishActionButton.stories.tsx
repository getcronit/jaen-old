import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {PublishActionButton} from './PublishActionButton.js'
export default {
  title: 'Atoms/PublishActionButton',
  component: PublishActionButton,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof PublishActionButton>

type ComponentProps = React.ComponentProps<typeof PublishActionButton>

// Create a template for the component
const Template: Story<ComponentProps> = args => (
  <PublishActionButton {...args} />
)

export const Basic: Story<ComponentProps> = Template.bind({})
