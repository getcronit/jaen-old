import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {withSnekFinder} from '../../../../context/SnekFinder/withSnekFinder.js'
import {SettingsView} from './SettingsView.js'
export default {
  title: 'templates/views/SettingsView',
  component: SettingsView,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Story => {
      const Wrapper = withSnekFinder(Story)

      return <Wrapper />
    }
  ]
} as ComponentMeta<typeof SettingsView>

type ComponentProps = React.ComponentProps<typeof SettingsView>

// Create a template for the component
const Template: Story<ComponentProps> = args => <SettingsView {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
