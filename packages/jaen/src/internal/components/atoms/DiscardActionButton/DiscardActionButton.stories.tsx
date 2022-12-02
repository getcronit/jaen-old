import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {DiscardActionButton} from './DiscardActionButton.js'
export default {
  title: 'Atoms/DiscardActionButton',
  component: DiscardActionButton,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof DiscardActionButton>

type ComponentProps = React.ComponentProps<typeof DiscardActionButton>

// Create a template for the component
const Template: Story<ComponentProps> = args => (
  <DiscardActionButton {...args} />
)

export const Basic: Story<ComponentProps> = Template.bind({})
