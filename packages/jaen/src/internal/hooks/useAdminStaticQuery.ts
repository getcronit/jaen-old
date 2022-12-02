import {IJaenPage} from '../../types.js'

import {useAdminStaticQuery as _q} from 'gatsby-plugin-jaen'

export const useAdminStaticQuery = () => {
  return _q<IJaenPage>()
}
