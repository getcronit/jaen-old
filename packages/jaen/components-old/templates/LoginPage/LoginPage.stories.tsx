import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {LoginPage} from './LoginPage.js'
export default {
  title: 'Templates/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof LoginPage>

type ComponentProps = React.ComponentProps<typeof LoginPage>

// Create a template for the component
const Template: Story<ComponentProps> = args => <LoginPage {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
