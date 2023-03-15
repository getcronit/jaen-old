import {AdminToolbar} from '../components/index.js'
import {PageContextType, PageProvider} from '../context/PageProvider.js'
import {withSnekFinder} from '../context/SnekFinder/withSnekFinder.js'
import {GatsbyRootWrapper} from '../index.js'

export type JaenMockProps = PageContextType

export const withJaenMock = <P extends object>(
  Component: React.ComponentType,
  mockProps: JaenMockProps
) => {
  const WithJaenMock: React.FC<P> = props => {
    return (
      <GatsbyRootWrapper {...mockProps}>
        <AdminToolbar />
        <PageProvider {...mockProps}>
          <Component {...props} />
        </PageProvider>
      </GatsbyRootWrapper>
    )
  }

  return withSnekFinder(WithJaenMock)
}
