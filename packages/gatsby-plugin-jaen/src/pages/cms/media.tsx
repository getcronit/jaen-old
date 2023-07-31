import {PageConfig} from '@snek-at/jaen'
import {PageProps} from 'gatsby'

import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import MediaContainer from '../../containers/media'
import {withTheme} from '../../theme/with-theme'

const MediaPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout layout="full">
      <MediaContainer />
    </JaenPageLayout>
  )
}

export default withTheme(MediaPage)

export const pageConfig: PageConfig = {
  label: 'Media',
  icon: 'FaImage',
  menu: {
    type: 'app',
    group: 'cms',
    order: 300
  },
  breadcrumbs: [
    {
      label: 'CMS',
      path: '/cms/'
    },
    {
      label: 'Media',
      path: '/cms/media/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isRequired: true
  }
}
