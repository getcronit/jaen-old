import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {CMSIndex} from './CMSIndex.js'
export default {
  title: 'Components/CMSIndex',
  component: CMSIndex,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof CMSIndex>

type ComponentProps = React.ComponentProps<typeof CMSIndex>

// Create a template for the component
const Template: Story<ComponentProps> = args => <CMSIndex {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
