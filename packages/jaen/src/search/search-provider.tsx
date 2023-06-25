import {withRedux} from '../internal/redux/index.js'

export const SearchProvider: React.FC<React.PropsWithChildren> = withRedux(
  props => {
    return <>{props.children}</>
  }
)
