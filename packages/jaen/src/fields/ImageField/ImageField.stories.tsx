import {Box} from '@chakra-ui/react'
import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {withJaenMock} from '../../internal/testing/withJaenMock.js'
import {ImageField} from './ImageField.js'
export default {
  title: 'fields/ImageField',
  component: ImageField,
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
} as ComponentMeta<typeof ImageField>

type ComponentProps = React.ComponentProps<typeof ImageField>

export const Basic: Story<ComponentProps> = () => {
  return (
    <Box bg="red" height={64}>
      <ImageField
        name="image"
        label="Image"
        defaultValue={undefined}
        objectFit="contain"
      />
    </Box>
  )
}
