import {GatsbyBrowser} from 'gatsby'

import {internal} from '@snek-at/jaen'

import '@snek-at/jaen/dist/index.css'

const {GatsbyRootWrapper, GatsbyPageWrapper} = internal

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
  pathname
}) => {
  // @ts-expect-error
  return <GatsbyRootWrapper>{element}</GatsbyRootWrapper>
}

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props
}) => {
  // @ts-expect-error
  return <GatsbyPageWrapper path={props.path}>{element}</GatsbyPageWrapper>
}
