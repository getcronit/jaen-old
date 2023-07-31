import {PageProps} from 'gatsby'

import {FormDataType, Settings} from '../../components/cms/Settings/Settings'
import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import {PageConfig} from '@snek-at/jaen'

const SettingsPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout>
      <Settings
        data={{}}
        isPublishing={false}
        migrations={[]}
        onUpdate={function (_data: FormDataType): void {
          throw new Error('Function not implemented.')
        }}
      />
    </JaenPageLayout>
  )
}

export default SettingsPage

export const pageConfig: PageConfig = {
  label: 'Settings',
  icon: 'FaCog',
  menu: {
    type: 'app',
    group: 'cms',
    order: 400
  },

  breadcrumbs: [
    {
      label: 'CMS',
      path: '/cms/'
    },
    {
      label: 'Settings',
      path: '/cms/settings/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isRequired: true
  },
  theme: 'jaen'
}
