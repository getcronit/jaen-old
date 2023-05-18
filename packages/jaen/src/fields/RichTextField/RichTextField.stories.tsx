import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {withJaenMock} from '../../internal/testing/withJaenMock.js'
import {RichTextField} from './RichTextField.js'
export default {
  title: 'fields/RichTextField',
  component: RichTextField,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Story => {
      const Mocked = withJaenMock(Story, {
        jaenPage: {
          id: `JaenPage jaen-page-1`,
          slug: 'jaen-page-1',
          parent: null,
          children: [],
          jaenPageMetadata: {
            title: 'Jaen Page 1',
            description: 'Jaen Page 1 description',
            image: 'https://via.placeholder.com/300x200',
            canonical: 'https://jaen.com/jaen-page-1',
            datePublished: '2020-01-01',
            isBlogPost: false
          },
          jaenFields: {
            'IMA:TextField': {
              'rich-text-field-1': {
                value: 'This is a text field'
              }
            }
          },
          chapters: {},
          template: 'BlogPage',
          jaenFiles: []
        }
      })

      return <Mocked />
    }
  ]
} as ComponentMeta<typeof RichTextField>

type ComponentProps = React.ComponentProps<typeof RichTextField>

// Create a template for the component
const Template: Story<ComponentProps> = args => <RichTextField {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {
  name: 'rich-text-field-1',
  defaultValue: 'This is a text field'
}
