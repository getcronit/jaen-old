import {views} from '../../src/internal/components/index.js'
import {PageManagerProvider} from '../../src/internal/context/PagesManagerContext.js'

export const PagesView = () => {
  return (
    <PageManagerProvider>
      <views.PagesView />
    </PageManagerProvider>
  )
}
