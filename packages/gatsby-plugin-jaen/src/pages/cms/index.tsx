import {PageConfig} from '@snek-at/jaen'
import {PageProps} from 'gatsby'

import {CMSIndex} from '../../components/cms/CMSIndex'
import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../theme/with-theme'

const PagesPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout>
      <CMSIndex
        pages={[
          {
            title: 'Pages',
            description: 'Manage your pages',
            path: '/cms/pages'
          },
          {
            title: 'Media',
            description: 'Manage your media',
            path: '/cms/media'
          },
          {
            title: 'Settings',
            description: 'Manage your settings',
            path: '/cms/settings'
          }
        ]}
      />
    </JaenPageLayout>
  )
}

export default withTheme(PagesPage)

export const pageConfig: PageConfig = {
  label: 'Dashboard',
  icon: 'FaTachometerAlt',
  menu: {
    type: 'app',
    group: 'cms',
    groupLabel: 'Jaen CMS',
    order: 100
  },
  breadcrumbs: [
    {
      label: 'CMS',
      path: '/cms/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isRequired: true
  },
  theme: 'jaen'
}
