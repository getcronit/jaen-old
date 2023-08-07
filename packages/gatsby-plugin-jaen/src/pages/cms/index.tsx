import {PageConfig, useAuthenticationContext} from '@snek-at/jaen'
import {PageProps} from 'gatsby'

import {CMSManagement, useCMSManagement} from '../../connectors/cms-management'
import {Dashboard} from '../../components/cms/Dashboard'
import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import {useEffect} from 'react'

const DashboardPage: React.FC<PageProps> = () => {
  const authentication = useAuthenticationContext()

  const manager = useCMSManagement()

  const user =
    authentication.user?.details?.firstName || authentication.user?.username

  return (
    <Dashboard
      user={user}
      isPublishing={manager.isPublishing}
      migrations={[
        {
          createdAt: '2021-08-01T00:00:00.000Z'
        }
      ]}
    />
  )
}

const Page: React.FC<PageProps> = props => {
  return (
    <CMSManagement>
      <DashboardPage {...props} />
    </CMSManagement>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Jaen Dashboard',
  icon: 'FaTachometerAlt',
  menu: {
    type: 'app',
    group: 'cms',
    label: 'Dashboard',
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
  layout: {
    name: 'jaen'
  }
}
