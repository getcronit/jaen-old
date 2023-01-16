import {views} from '../components/index.js'
import {usePopupComponents} from '../hooks/usePopupComponents.js'
import {withRedux} from '../redux/index.js'

export const PopupsView = withRedux(() => {
  const {isLoading, popups, togglePopup} = usePopupComponents()

  return (
    <views.PopupsView
      isLoading={isLoading}
      popups={popups}
      onPopupEnableToggle={togglePopup}
    />
  )
})
