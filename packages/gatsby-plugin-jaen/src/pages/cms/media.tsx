import {PageProps} from 'gatsby'
import {withTheme} from '../../theme/with-theme'

import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import {MediaContainer} from '../../containers/media'
import {PageConfig} from '@snek-at/jaen'

const MediaPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout layout="full">
      <MediaContainer mediaNodes={[]} />
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
    groupLabel: 'Jaen CMS',
    order: 300
  },
  breadcrumbs: [
    {
      label: 'Media',
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
