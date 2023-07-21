import {views} from '../../src/internal/components/index.js'
import {useSite} from '../../src/internal/hooks/site/useSite.js'
import {useAppDispatch} from '../../src/internal/redux/index.js'
import {updateSiteMetadata} from '../../src/internal/redux/slices/site.js'
import {ISite} from '../../src/types.js'

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
