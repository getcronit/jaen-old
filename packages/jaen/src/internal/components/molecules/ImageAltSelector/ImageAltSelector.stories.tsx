import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {ImageAltSelector} from './ImageAltSelector.js'
export default {
  title: 'molecules/ImageAltSelector',
  component: ImageAltSelector,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof ImageAltSelector>

type ComponentProps = React.ComponentProps<typeof ImageAltSelector>

// Create a template for the component
const Template: Story<ComponentProps> = args => <ImageAltSelector {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
Basic.args = {
  value: 'This is a description'
}
