import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {SaveDraftActionButton} from './SaveDraftActionButton.js'
export default {
  title: 'Atoms/SaveDraftActionButton',
  component: SaveDraftActionButton,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof SaveDraftActionButton>

type ComponentProps = React.ComponentProps<typeof SaveDraftActionButton>

// Create a template for the component
const Template: Story<ComponentProps> = args => (
  <SaveDraftActionButton {...args} />
)

export const Basic: Story<ComponentProps> = Template.bind({})
