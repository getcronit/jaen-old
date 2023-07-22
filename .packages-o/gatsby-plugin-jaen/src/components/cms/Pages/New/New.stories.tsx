import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {New} from './New.js'
export default {
  title: 'Components/New',
  component: New,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof New>

type ComponentProps = React.ComponentProps<typeof New>

// Create a template for the component
const Template: Story<ComponentProps> = args => <New {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
