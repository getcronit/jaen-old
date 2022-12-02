import {Box, Button} from '@chakra-ui/react'
import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {
  NewsSlideProvider,
  useNewsSlide
} from '../../../context/NewsSlideContext.js'
import {NewsSlide} from './NewsSlide.js'

export default {
  title: 'Molecules/NewsSlide',
  component: NewsSlide,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    story => (
      <NewsSlideProvider>
        <OpenButton />
        <Box h="50vh" bg="red">
          {story()}
        </Box>
      </NewsSlideProvider>
    )
  ]
} as ComponentMeta<typeof NewsSlide>

const OpenButton = () => {
  const {onToggle} = useNewsSlide()

  return <Button onClick={onToggle}>Open</Button>
}

type ComponentProps = React.ComponentProps<typeof NewsSlide>

// Create a template for the component
const Template: Story<ComponentProps> = args => <NewsSlide {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
