import {CreatePageArgs} from 'gatsby'

import {readPageConfig} from '../utils/page-config-reader'

export const onCreatePage = async ({actions, page}: CreatePageArgs) => {
  const jaenPageId = page.context?.jaenPageId as string | undefined

  if (!jaenPageId) {
    const pageConfig = readPageConfig(page.component)

    actions.deletePage(page)

    actions.createPage({
      ...page,
      context: {
        ...page.context,
        jaenPageId: `JaenPage ${page.path}`,
        pageConfig
      }
    })
  }
}
