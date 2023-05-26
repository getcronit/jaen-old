import {Head as JaenHead, internal} from '@snek-at/jaen'
import {HeadProps, PageProps} from 'gatsby'

const {LoginPage} = internal

const LoginPageContainer: React.FC<PageProps> = props => {
  return <LoginPage {...props} />
}

export default LoginPageContainer

export const Head = (props: HeadProps) => {
  return (
    <JaenHead {...props}>
      <title id="title">Jaen Admin | Login</title>
    </JaenHead>
  )
}
