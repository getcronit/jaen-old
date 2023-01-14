import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {FiFileText, FiImage, FiBox} from 'react-icons/fi'
import {SectionBlockSelectorButton} from './SectionBlockSelectorButton.js'
export default {
  title: 'Organisms/SectionBlockSelectorButton',
  component: SectionBlockSelectorButton,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof SectionBlockSelectorButton>

type ComponentProps = React.ComponentProps<typeof SectionBlockSelectorButton>

// Create a template for the component
const Template: Story<ComponentProps> = args => (
  <SectionBlockSelectorButton {...args} />
)

const BLOCK_TYPES = [
  {
    slug: 'text',
    title: 'Text',
    icon: FiFileText
  },
  {
    slug: 'image',
    title: 'Image',
    icon: FiImage
  },
  {
    slug: 'threecard',
    title: 'Three Card',
    icon: FiBox
  }
]

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {
  blocks: BLOCK_TYPES,
  onBlockAdd: () => {}
}
