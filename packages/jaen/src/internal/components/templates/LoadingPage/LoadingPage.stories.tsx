import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {LoadingPage} from './LoadingPage.js'
export default {
  title: 'templates/LoadingPage',
  component: LoadingPage,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof LoadingPage>

type ComponentProps = React.ComponentProps<typeof LoadingPage>

// Create a template for the component
const Template: Story<ComponentProps> = args => <LoadingPage {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
