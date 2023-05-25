import {Box} from '@chakra-ui/react'
import {GatsbyLinkProps, Link as GatsbyLink} from 'gatsby'
import {Field} from '../index.js'

export const Image = ({name, defaultValue, ...rest}: any) => {
  return (
    <Box {...rest}>
      <Field.Image name={name} defaultValue={defaultValue} />
    </Box>
  )
}

Image.defaultProps = {
  name: () => `image-${(Math.random() + 1).toString(36).substring(7)}`,
  defaultValue: 'https://via.placeholder.com/150'
}

export const Link: React.FC<GatsbyLinkProps<any>> = ({children, ...rest}) => {
  return <GatsbyLink {...(rest as any)}>{children}</GatsbyLink>
}

Link.defaultProps = {
  to: '/',
  children: 'My Link'
}
