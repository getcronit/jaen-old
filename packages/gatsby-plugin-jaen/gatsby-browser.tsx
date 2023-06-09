import {GatsbyBrowser} from 'gatsby'

import {internal} from '@snek-at/jaen'

import '@snek-at/jaen/dist/index.css'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const {GatsbyRootWrapper, GatsbyPageWrapper, CookieConsent} = internal

const scrollTo = (id: any) => () => {
  try {
    const el = document.querySelector(id)
    if (el) {
      window.scrollTo(0, el.offsetTop - 20)
    }
  } catch (e) {}
}

export const onRouteUpdate = ({location: {hash}}: any) => {
  if (hash) {
    window.setTimeout(scrollTo(hash), 10)
  }
}

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element
}) => {
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
  // @ts-ignore-error
  return <GatsbyPageWrapper pageProps={props}>{element}</GatsbyPageWrapper>
}
