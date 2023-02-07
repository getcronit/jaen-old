import {internal} from '@snek-at/jaen'
import {HeadProps} from 'gatsby'

import {BiNotification} from 'react-icons/bi'
import {BsFiles, BsGear, BsLayoutTextSidebar} from 'react-icons/bs'

import {Head as JaenHead} from './dist/SEO/Head'

const {AdminPage} = internal

const AdminPageContainer = () => {
  return (
    <AdminPage
      views={[
        // {
        //   path: '/',
        //   Component: internal.views.HomeView,
        //   label: 'Home',
        //   Icon: BsHouse
        // },
        {
          path: '/',
          Component: internal.views.PagesView,
          label: 'Pages',
          group: 'Your Site',
          Icon: BsLayoutTextSidebar
        },
        {
          path: '/files',
          Component: internal.views.FilesView,
          label: 'Files',
          group: 'Your Site',
          Icon: BsFiles
        },
        {
          path: '/popups',
          Component: internal.views.PopupsView,
          label: 'Popups',
          group: 'Your Site',
          Icon: BiNotification
        },
        {
          path: '/settings',
          Component: internal.views.SettingsView,
          label: 'Settings',
          group: 'Your Site',
          Icon: BsGear
        }
      ]}
    />
  )
}

export default AdminPageContainer

export const Head = (props: HeadProps) => {
  return (
    <JaenHead {...props}>
      <title id="title">Jaen Admin</title>
    </JaenHead>
  )
}
