import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {DividerWithText} from './DividerWithText.js'
export default {
  title: 'Components/DividerWithText',
  component: DividerWithText,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof DividerWithText>

type ComponentProps = React.ComponentProps<typeof DividerWithText>

// Create a template for the component
const Template: Story<ComponentProps> = args => <DividerWithText {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
