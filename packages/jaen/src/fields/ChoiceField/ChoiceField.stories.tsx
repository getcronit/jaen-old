import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {withJaenMock} from '../../withJaenMock.js'
import {ChoiceField} from './ChoiceField.js'
export default {
  title: 'fields/ChoiceField',
  component: ChoiceField,
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
          jaenFields: null,
          chapters: {},
          template: 'BlogPage',
          jaenFiles: []
        }
      })

      return <Mocked />
    }
  ]
} as ComponentMeta<typeof ChoiceField>

type ComponentProps = React.ComponentProps<typeof ChoiceField>

// Create a template for the component
const Template: Story<ComponentProps> = args => <ChoiceField {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
Basic.args = {
  name: 'choice-field-1',
  options: ['1x', '2x', '3x', '4x', '5x'],
  defaultValue: null,
  render: (selectedOption, options) => (
    <div>
      <h1>{selectedOption}</h1>
      <ul>
        {options.map(option => (
          <li key={option}>{option}</li>
        ))}
      </ul>
    </div>
  ),
  renderPopover: (selectedOption, options, select) => (
    <div>
      <h1>{selectedOption}</h1>
      <ul>
        {options.map(option => (
          <li
            key={option}
            onClick={() => {
              select(option)
            }}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  )
}
