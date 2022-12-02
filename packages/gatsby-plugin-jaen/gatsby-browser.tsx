import {GatsbyBrowser} from 'gatsby'
import React from 'react'

import {internal} from '@snek-at/jaen'

import '@snek-at/jaen/dist/index.css'

const {GatsbyRootWrapper, GatsbyPageWrapper} = internal

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
  pathname
}) => {
  return <GatsbyRootWrapper>{element}</GatsbyRootWrapper>
}

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props
}) => {
  return <GatsbyPageWrapper path={props.path}>{element}</GatsbyPageWrapper>
}
