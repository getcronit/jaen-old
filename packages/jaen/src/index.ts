export {Head} from 'gatsby-plugin-jaen'
export {
  connectBlock,
  connectField,
  connectPage,
  connectPopup,
  connectTemplate,
  connectView
} from './connectors/index.js'
export * from './fields/index.js'
export {usePageContext} from './internal/context/PageProvider.js'
export {useSectionBlockContext} from './internal/context/SectionBlockContext.js'
export {useStatus} from './internal/hooks/useStatus.js'
export {useWidget} from './internal/hooks/useWidget.js'
export * as internal from './internal/index.js'
export {withJaenMock} from './internal/testing/withJaenMock.js'
export {snekResourceId} from './snekResourceId.js'
export type {IJaenPage, PageProps, SiteMetadata} from './types.js'

export const getCookieConsentApi = () => {
  return window.CookieConsentApi
}
