import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {ImageEditButton} from './ImageEditButton.js'
export default {
  title: 'molecules/ImageEditButton',
  component: ImageEditButton,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof ImageEditButton>

type ComponentProps = React.ComponentProps<typeof ImageEditButton>

// Create a template for the component
const Template: Story<ComponentProps> = args => <ImageEditButton {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
