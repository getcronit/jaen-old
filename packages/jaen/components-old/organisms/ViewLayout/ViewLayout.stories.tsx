import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {ViewLayout} from './ViewLayout.js'
export default {
  title: 'Components/ViewLayout',
  component: ViewLayout,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof ViewLayout>

type ComponentProps = React.ComponentProps<typeof ViewLayout>

// Create a template for the component
const Template: Story<ComponentProps> = args => <ViewLayout {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
