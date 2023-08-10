import {JaenPage} from '@snek-at/jaen'
import {CreatePagesArgs} from 'gatsby'
import {getJaenPageParentId} from '../utils/get-jaen-page-parent-id'

export const createPages = async (args: CreatePagesArgs) => {
  const {actions, graphql, reporter, getNode} = args

  const {createPage} = actions

  reporter.info('Creating pages...')

  const {data, errors} = await graphql<{
    jaenData: {
      pages: Partial<JaenPage>[]
    }
    allSitePage: {
      nodes: {
        id: string
        pageContext: object
      }[]
    }
  }>(`
    query {
      jaenData {
        pages
      }

      allSitePage {
        nodes {
          id
          pageContext
        }
      }
    }
  `)

  if (errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }

  console.log(data)

  for (const page of data?.jaenData?.pages || []) {
    if (!page.id) {
      reporter.warn(`Page ${page.title} has no id. Skipping...`)
      continue
    }

    const pathOrUUID = page.id.split('JaenPage ')[1]

    if (!pathOrUUID) {
      reporter.warn(`Page ${page.title} has no path or uuid. Skipping...`)
      continue
    }

    // const path = pathOrUUID.replace(/\/+$/, '') // Remove trailing slashes from the path
    // const lastPathElement = path.split('/').pop() || path

    // const preparedPage = {
    //   ...page,
    //   slug: page.slug || lastPathElement,
    //   parent: getJaenPageParentId({
    //     parent: page.parent?.id ? {id: page.parent.id} : null,
    //     id: page.id
    //   }),
    //   children: [],
    //   jaenPageMetadata: {
    //     title:
    //   }
    // }

    // check if node already exists

    const node = getNode(page.id)

    console.log(`Node ${page.id}`, node)
  }
}
