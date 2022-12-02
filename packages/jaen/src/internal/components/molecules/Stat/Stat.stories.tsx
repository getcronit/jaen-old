import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {Stat} from './Stat.js'
export default {
  title: 'Components/Stat',
  component: Stat,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Stat>

type ComponentProps = React.ComponentProps<typeof Stat>

// Create a template for the component
const Template: Story<ComponentProps> = args => <Stat {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
