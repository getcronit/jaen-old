import {useEffect} from 'react'
import 'vanilla-cookieconsent'
import pluginConfig from './CookieConsentConfig.js'

export interface CookieConsentProps {}

export const CookieConsent: React.FC<CookieConsentProps> = () => {
  useEffect(() => {
    /**
     * useEffect is executed twice (React 18+),
     * make sure the plugin is initialized and executed once
     */
    if (!document.getElementById('cc--main')) {
      window.CookieConsentApi = window.initCookieConsent()
      window.CookieConsentApi.run(pluginConfig)
    }
  }, [])

  return null
}
