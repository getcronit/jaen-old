import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {LoginForm} from './LoginForm.js'
export default {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof LoginForm>

type ComponentProps = React.ComponentProps<typeof LoginForm>

// Create a template for the component
const Template: Story<ComponentProps> = args => <LoginForm {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
