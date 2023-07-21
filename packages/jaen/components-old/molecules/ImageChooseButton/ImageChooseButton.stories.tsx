import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {ImageChooseButton} from './ImageChooseButton.js'
export default {
  title: 'molecules/ImageChooseButton',
  component: ImageChooseButton,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof ImageChooseButton>

type ComponentProps = React.ComponentProps<typeof ImageChooseButton>

// Create a template for the component
const Template: Story<ComponentProps> = args => <ImageChooseButton {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
