import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import {CookieConsent} from './CookieConsent.js'
export default {
  title: 'Components/CookieConsent',
  component: CookieConsent,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof CookieConsent>

type ComponentProps = React.ComponentProps<typeof CookieConsent>

// Create a template for the component
const Template: Story<ComponentProps> = args => <CookieConsent {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})
