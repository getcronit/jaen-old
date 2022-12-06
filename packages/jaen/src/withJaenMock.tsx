import {AdminToolbar} from './internal/components/index.js'
import {PageContext, PageProvider} from './internal/context/PageProvider.js'
import {withSnekFinder} from './internal/context/SnekFinder/withSnekFinder.js'
import {GatsbyRootWrapper} from './internal/index.js'

export type JaenMockProps = PageContext

export const withJaenMock = <P extends object>(
  Component: React.ComponentType,
  mockProps: JaenMockProps
) => {
  const WithJaenMock: React.FC<P> = props => {
    return (
      <GatsbyRootWrapper {...mockProps}>
        <AdminToolbar withoutPageNavigator />
        <PageProvider {...mockProps}>
          <Component {...props} />
        </PageProvider>
      </GatsbyRootWrapper>
    )
  }

  return withSnekFinder(WithJaenMock)
}
