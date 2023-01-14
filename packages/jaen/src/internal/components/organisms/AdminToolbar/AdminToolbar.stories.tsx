import {Box, Flex} from '@chakra-ui/react'
import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {AdminToolbar} from './AdminToolbar.js'
export default {
  title: 'organisms/AdminToolbar',
  component: AdminToolbar,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    story => (
      <Flex flexDir="column" h="100vh">
        {story()}

        <Box bg="red" flex="1">
          <iframe
            src="https://www.yubo.live"
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      </Flex>
    )
  ]
} as ComponentMeta<typeof AdminToolbar>

type ComponentProps = React.ComponentProps<typeof AdminToolbar>

// Create a template for the component
const Template: Story<ComponentProps> = args => <AdminToolbar {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {}
