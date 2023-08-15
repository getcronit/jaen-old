import {JaenPage} from '@snek-at/jaen'
import {CreatePagesArgs, Node} from 'gatsby'
import {getJaenPageParentId} from '../utils/get-jaen-page-parent-id'

export const createPages = async (args: CreatePagesArgs) => {
  const {actions, graphql, reporter, getNode, getNodesByType} = args

  reporter.info('Creating pages...')

  const result = await graphql<{
    allTemplate: {
      nodes: Array<{
        id: string
        absolutePath: string
        relativePath: string
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
    }
  `)

  if (result.errors || !result.data) {
    reporter.panicOnBuild(`Error while running GraphQL query. ${result.errors}`)

    return
  }

  const {allTemplate} = result.data

  const allJaenPageNodes = getNodesByType('JaenPage') as Array<Node & JaenPage>

  for (const node of allJaenPageNodes) {
    const pagePath = '/'

    if (node.template) {
      if (!pagePath) {
        reporter.panicOnBuild(`Error while generating path for page ${node.id}`)
        return
      }

      const template = allTemplate.nodes.find(
        template => template.id === node.template
      )

      if (!template) {
        reporter.panicOnBuild(`Template ${node.template} not found`)
        return
      }

      actions.createPage({
        path: pagePath,
        component: template.absolutePath,
        context: {
          jaenPageId: node.id
        }
      })
    }
  }
}
