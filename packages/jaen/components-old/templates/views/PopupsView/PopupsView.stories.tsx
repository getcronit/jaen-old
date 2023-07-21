import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {connectPopup} from '../../../../../connectors/connectPopup.js'
import {PopupsView} from './PopupsView.js'
export default {
  title: 'templates/views/PopupsView',
  component: PopupsView,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof PopupsView>

type ComponentProps = React.ComponentProps<typeof PopupsView>

// Create a template for the component
const Template: Story<ComponentProps> = args => <PopupsView {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})

Basic.args = {
  isLoading: false,
  popups: [
    {
      id: '1',
      isActive: true,
      Component: connectPopup(() => <div>1</div>, {
        label: 'Popup 1',
        description: 'Popup 1 description',
        imageURL: 'https://via.placeholder.com/150',
        conditions: {
          entireSite: true
        },
        triggers: {
          onPageLoad: 1
        }
      })
    }
  ]
}
