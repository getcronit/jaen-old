import {useAppSelector} from '../redux/index.js'

export const useHasChanges = (): boolean => {
  const pageNodes = useAppSelector(state => state.page.pages.nodes)
  const popupNodes = useAppSelector(state => state.popup.nodes)
  const siteMetadata = useAppSelector(state => state.site.siteMetadata)

  return (
    Object.keys(pageNodes).length > 0 ||
    Object.keys(popupNodes).length > 0 ||
    Object.keys(siteMetadata).length > 0
  )
}
