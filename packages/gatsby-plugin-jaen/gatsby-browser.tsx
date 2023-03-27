import {GatsbyBrowser} from 'gatsby'

import {internal} from '@snek-at/jaen'

import '@snek-at/jaen/dist/index.css'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const {GatsbyRootWrapper, GatsbyPageWrapper, CookieConsent} = internal

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
  pathname
}) => {
  // @ts-expect-error
  return (
    <GatsbyRootWrapper>
      <CookieConsent />
      {element}
    </GatsbyRootWrapper>
  )
}

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props
}) => {
  // @ts-expect-error
  return <GatsbyPageWrapper pageProps={props}>{element}</GatsbyPageWrapper>
}
