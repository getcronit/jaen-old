import {ISite} from '../../types.js'
import {views} from '../components/index.js'
import {useSite} from '../hooks/site/useSite.js'
import {useAppDispatch} from '../redux/index.js'
import {updateSiteMetadata} from '../redux/slices/site.js'

export const SettingsView = () => {
  const dispatch = useAppDispatch()

  const site = useSite()

  const handleUpdate = (data: ISite) => {
    if (data.siteMetadata) {
      dispatch(updateSiteMetadata(data.siteMetadata))
    }
  }

  return <views.SettingsView data={site} onUpdate={handleUpdate} />
}
