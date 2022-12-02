import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {HomeView} from './HomeView.js'
export default {
  title: 'templates/views/HomeView',
  component: HomeView,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof HomeView>

type ComponentProps = React.ComponentProps<typeof HomeView>

// Create a template for the component
const Template: Story<ComponentProps> = args => <HomeView {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
