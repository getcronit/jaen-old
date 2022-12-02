import * as React from 'react'

import {internal} from '@snek-at/jaen'

import {BsHouse, BsFiles, BsLayoutTextSidebar} from 'react-icons/bs'

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
        }
      ]}
    />
  )
}

export default AdminPageContainer
