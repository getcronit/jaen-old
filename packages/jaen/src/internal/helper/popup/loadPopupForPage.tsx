import {PageProps} from '../../../types.js'
import {IPopupState} from '../../redux/types.js'
import {loadPopupComponents} from './loadPopupComponents.js'
import {QueryData} from './types.js'

export const loadNotificationsForPage = async (
  jaenPopup: QueryData['jaenPopup'],
  allJaenPopup: QueryData['allJaenPopup'],
  dynamicNotifications: IPopupState['nodes'],
  pageProps: PageProps,
  stateAdvanced: IPopupState['advanced']
) => {
  const blacklist = ['/admin']

  if (blacklist.some(item => pageProps.path.startsWith(item))) {
    return []
  }

  const popups = await loadPopupComponents(jaenPopup, allJaenPopup)

  const allNotificationElement: Array<JSX.Element> = []

  for (const {Component, id, isActive, popup} of popups) {
    const isDynamicActive: boolean | undefined =
      dynamicNotifications?.[id]?.active

    if (isDynamicActive === false) {
      continue
    }

    if (isDynamicActive === undefined) {
      if (isActive === false) {
        continue
      }
    }

    const pushNotification = () => {
      allNotificationElement.push(<Component id={id} popup={popup} />)
    }

    const {advanced, conditions, customCondition} = Component.options

    //> Advanced
    const notificationAdvanced = stateAdvanced[id]
    if (advanced && notificationAdvanced) {
      if (advanced.showAfterXPageViews) {
        if (notificationAdvanced.pageViews >= advanced.showAfterXPageViews) {
          pushNotification()
        }
        continue
      }

      if (advanced.showUntilXPageViews) {
        if (notificationAdvanced.pageViews <= advanced.showUntilXPageViews) {
          pushNotification()
        }
        continue
      }
    }

    //> Conditions
    if (customCondition) {
      const condition = customCondition(pageProps)

      if (condition) {
        pushNotification()
      }
      continue
    }

    if (conditions) {
      const {entireSite, templates, urlPatterns} = conditions
      //> Entire site
      if (entireSite) {
        pushNotification()
        continue
      }

      //> Templates
      if (templates) {
        const staticTemplate = pageProps.data?.jaenPage?.template

        if (staticTemplate && templates.includes(staticTemplate)) {
          pushNotification()
          continue
        }
      }

      //> Url patterns
      if (urlPatterns) {
        const staticUrl = pageProps.location.pathname

        for (const urlPattern of urlPatterns) {
          if (staticUrl.match(urlPattern)) {
            pushNotification()
            continue
          }
        }
      }
    }
  }

  return allNotificationElement
}
