import {views} from '../../src/internal/components/index.js'
import {usePopupComponents} from '../../src/internal/hooks/usePopupComponents.js'
import {withRedux} from '../../src/internal/redux/index.js'

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
