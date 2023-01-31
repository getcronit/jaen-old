import {Box, Stack} from '@chakra-ui/react'
import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {AdminShell} from './AdminShell.js'
export default {
  title: 'Templates/AdminShell',
  component: AdminShell,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof AdminShell>

type ComponentProps = React.ComponentProps<typeof AdminShell>

// Create a template for the component
const Template: Story<ComponentProps> = args => <AdminShell {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {
  children: (
    <Stack h="5000px" bg="red.50" spacing="8">
      {Array.from({length: 100}).map((_, i) => {
        return (
          <Box key={i} h="100px" bg="red.400" zIndex="99999">
            {i}
          </Box>
        )
      })}
    </Stack>
  )
}
