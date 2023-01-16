import {internal} from '@snek-at/jaen'

import {BiNotification} from 'react-icons/bi'
import {BsFiles, BsHouse, BsLayoutTextSidebar} from 'react-icons/bs'

const {AdminPage} = internal

const AdminPageContainer = () => {
  return (
    <AdminPage
      views={[
        {
          path: '/',
          Component: internal.views.HomeView,
          label: 'Home',
          Icon: BsHouse
        },
        {
          path: '/pages',
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
        }
      ]}
    />
  )
}

export default AdminPageContainer
