import deepmerge from 'deepmerge'
import {deepmergeArrayIdMerge} from 'packages/jaen/src/utils/deepmerge.js'
import {useAppSelector} from '../../redux/index.js'
import {useAdminStaticQuery} from '../useAdminStaticQuery.js'

export const useSite = () => {
  const staticData = useAdminStaticQuery()

  const site = useAppSelector(state => state.site)

  const mergedSite = deepmerge(staticData.site, site || {}, {
    arrayMerge: deepmergeArrayIdMerge
  })

  return mergedSite
}
