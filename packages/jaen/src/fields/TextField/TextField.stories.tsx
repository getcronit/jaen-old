import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {TextField} from './TextField.js'
export default {
  title: 'fields/TextField',
  component: TextField,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof TextField>

type ComponentProps = React.ComponentProps<typeof TextField>

// Create a template for the component
const Template: Story<ComponentProps> = args => <TextField {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
