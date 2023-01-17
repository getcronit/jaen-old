import {AddIcon} from '@chakra-ui/icons'
import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {SelectorButton} from './SelectorButton.js'
export default {
  title: 'organisms/SelectorButton',
  component: SelectorButton,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof SelectorButton>

type ComponentProps = React.ComponentProps<typeof SelectorButton>

// Create a template for the component
const Template: Story<ComponentProps> = args => <SelectorButton {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {
  icon: <AddIcon />,
  children: <div>Children</div>
}
