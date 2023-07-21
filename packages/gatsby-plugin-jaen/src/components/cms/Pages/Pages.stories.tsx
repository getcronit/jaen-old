import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {Pages} from './Pages.js'
export default {
  title: 'cms/Pages',
  component: Pages,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Pages>

type ComponentProps = React.ComponentProps<typeof Pages>

// Create a template for the component
const Template: Story<ComponentProps> = args => <Pages {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
