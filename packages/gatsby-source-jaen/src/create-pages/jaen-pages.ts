import {JaenPage} from '@snek-at/jaen'
import {CreatePagesArgs} from 'gatsby'
import {getJaenPageParentId} from '../utils/get-jaen-page-parent-id'

export const createPages = async (args: CreatePagesArgs) => {
  const {actions, graphql, reporter, getNode} = args

  reporter.info('Creating pages...')

  const {data, errors} = await graphql<{
    allJaenPage: {
      nodes: Array<JaenPage>
    }
  }>(`
    query CreateJaenPages {
      allJaenPage {
        nodes {
          ...JaenPageData
        }
      }
    }
  `)

  if (errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }

  console.log(data)

  if (!data) {
    reporter.panic('Data is not defined')

    return
  }

  for (const page of data.allJaenPage.nodes) {
    actions.createPage({})

    // Component from JaenPage

    // If page already exisits delete it and update jaenPageId and pageConfig
    // OR Get pageConfig from jaenPage and update the jaenPageId and pageConfig

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
