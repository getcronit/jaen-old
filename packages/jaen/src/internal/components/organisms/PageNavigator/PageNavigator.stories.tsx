import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {PageNavigator} from './PageNavigator.js'
export default {
  title: 'Components/PageNavigator',
  component: PageNavigator,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof PageNavigator>

type ComponentProps = React.ComponentProps<typeof PageNavigator>

// Create a template for the component
const Template: Story<ComponentProps> = args => <PageNavigator {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
