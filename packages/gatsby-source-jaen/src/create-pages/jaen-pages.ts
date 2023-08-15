import {CreatePagesArgs} from 'gatsby'
import {onCreatePage} from '../on-create-page/jaen-page'
import {generatePageOriginPath} from '../utils/path'

export const createPages = async (args: CreatePagesArgs) => {
  const {actions, graphql, reporter} = args

  reporter.info('Creating pages...')

  const result = await graphql<{
    allJaenTemplate: {
      nodes: Array<{
        id: string
        absolutePath: string
        relativePath: string
      }>
    }
    allJaenPage: {
      nodes: Array<{
        id: string
        template: string | null
        slug: string
        parent: {
          id: string
        } | null
      }>
    }
  }>(`
    query {
      allJaenTemplate {
        nodes {
          id
          absolutePath
          relativePath
        }
      }
      allJaenPage {
        nodes {
          id
          template
          slug
          parent {
            id
          }
        }
      }
    }
  `)

  console.log('RESULT aaa', result)

  if (result.errors || !result.data) {
    reporter.panicOnBuild(`Error while running GraphQL query. ${result.errors}`)

    return
  }

  const {allJaenTemplate, allJaenPage} = result.data

  console.log('RESULTS', result.data)

  console.log(
    'allJaenPageNodes',
    allJaenPage.nodes.map(node => node.id)
  )

  for (const node of allJaenPage.nodes) {
    const pagePath = generatePageOriginPath(allJaenPage.nodes, node)

    console.log('Creating pagEEEEEEEe', node.id, node.template)

    if (node.template) {
      console.log('WTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
      if (!pagePath) {
        reporter.panicOnBuild(`Error while generating path for page ${node.id}`)
        return
      }

      const jaenTemplate = allJaenTemplate.nodes.find(
        template => template.id === node.template
      )

      console.log('jaenTemplate', jaenTemplate)

      if (!jaenTemplate) {
        reporter.panicOnBuild(`Template ${node.template} not found`)
        return
      }

      const page = {
        path: pagePath,
        component: jaenTemplate.absolutePath,
        context: {}
      }

      console.log('Before creating page', page)

      actions.createPage(page)

      // manually call onCreatePage for the page

      console.log('Creating Template', page.path)

      onCreatePage({
        ...args,
        page
      })
    }
  }
}
