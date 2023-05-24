export {Head} from 'gatsby-plugin-jaen'
export {PhotoProvider} from 'react-photo-view'
export {
  connectBlock,
  connectField,
  connectPage,
  connectPopup,
  connectTemplate,
  connectView
} from './connectors/index.js'
export * from './fields/index.js'
export {usePageManager} from './internal/context/AdminPageManager/AdminPageManager.js'
export {usePageContext} from './internal/context/PageProvider.js'
export {PageManagerProvider} from './internal/context/PagesManagerContext.js'
export {useSectionBlockContext} from './internal/context/SectionBlockContext.js'
export {generatePageOriginPath} from './internal/helper/path.js'
export {useStatus} from './internal/hooks/useStatus.js'
export {useWidget} from './internal/hooks/useWidget.js'
export * as internal from './internal/index.js'
export {withJaenMock} from './internal/testing/withJaenMock.js'
export {snekResourceId} from './snekResourceId.js'
export type {IJaenPage, PageProps, SiteMetadata} from './types.js'

export const getCookieConsentApi = () => {
  return window.CookieConsentApi
}
