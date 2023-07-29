import {As, Link as ChakraLink} from '@chakra-ui/react'
import {Link as GatsbyLink} from 'gatsby'
import React from 'react'

import {isInternalLink} from './utils/is-internal-path'

export interface LinkProps<T extends As> extends React.ComponentProps<any> {
  to?: string
  as?: T
  isDisabled?: boolean
  children: React.ReactNode
}

export function Link<T extends As>({as, to, ...props}: LinkProps<T>) {
  const Wrapper = as || ChakraLink

  if (to && !props.isDisabled) {
    const isInternal = isInternalLink(to)

    if (isInternal) {
      return <Wrapper as={GatsbyLink} to={to} {...props} />
    }

    return <Wrapper as="a" href={to} {...props} />
  }

  return <Wrapper {...props} />
}
