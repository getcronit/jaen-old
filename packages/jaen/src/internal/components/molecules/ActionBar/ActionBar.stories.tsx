import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {ActionBar} from './ActionBar.js'
export default {
  title: 'Components/ActionBar',
  component: ActionBar,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof ActionBar>

type ComponentProps = React.ComponentProps<typeof ActionBar>

// Create a template for the component
const Template: Story<ComponentProps> = args => <ActionBar {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
