import {PageProps} from 'gatsby'
import {PageConfig, useNotificationsContext} from '@snek-at/jaen'

import {FormDataType, Settings} from '../../components/cms/Settings/Settings'
import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import {CMSManagement, useCMSManagement} from '../../connectors/cms-management'

const SettingsPage: React.FC<PageProps> = () => {
  const manager = useCMSManagement()
  const {toast} = useNotificationsContext()

  return (
    <Settings
      data={{siteMetadata: manager.siteMetadata}}
      onUpdate={({siteMetadata}: FormDataType) => {
        manager.updateSiteMetadata(siteMetadata || {})

        toast({
          title: 'Settings updated',
          status: 'success'
        })
      }}
    />
  )
}

const Page: React.FC<PageProps> = props => {
  return (
    <CMSManagement>
      <SettingsPage {...props} />
    </CMSManagement>
  )
}

export default Page

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
  layout: {
    name: 'jaen',
    width: 'full'
  }
}
