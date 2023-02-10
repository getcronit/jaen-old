import {internal} from '@snek-at/jaen'
import {HeadProps} from 'gatsby'

import {GiRuleBook} from 'react-icons/gi'

import {Head as JaenHead} from './dist/SEO/Head'

const {AdminPage} = internal

const AdminPageContainer = () => {
  return (
    <AdminPage
      views={[
        {
          path: '/',
          Component: internal.views.CMS,
          label: 'Site Management',
          Icon: GiRuleBook,
          hasRoutes: true
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
