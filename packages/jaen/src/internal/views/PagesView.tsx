import {views} from '../components/index.js'
import {PageManagerProvider} from '../context/PagesManagerContext.js'

export const PagesView = () => {
  return (
    <PageManagerProvider>
      <views.PagesView />
    </PageManagerProvider>
  )
}
