import {GatsbySSR} from 'gatsby'

import {internal} from '@snek-at/jaen'

import '@snek-at/jaen/dist/index.css'

const {GatsbyRootWrapper, GatsbyPageWrapper} = internal

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({element}) => {
  // @ts-expect-error
  return <GatsbyRootWrapper ssr>{element}</GatsbyRootWrapper>
}

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({
  element,
  props
}) => {
  return (
    // @ts-expect-error
    <GatsbyPageWrapper path={props.path} ssr>
      {element}
    </GatsbyPageWrapper>
  )
}
