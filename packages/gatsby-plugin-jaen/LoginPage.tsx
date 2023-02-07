import {Head as JaenHead, internal} from '@snek-at/jaen'
import {HeadProps} from 'gatsby'

const {LoginPage} = internal

const LoginPageContainer = () => {
  return <LoginPage />
}

export default LoginPageContainer

export const Head = (props: HeadProps) => {
  return (
    <JaenHead {...props}>
      <title id="title">Jaen Admin | Login</title>
    </JaenHead>
  )
}
