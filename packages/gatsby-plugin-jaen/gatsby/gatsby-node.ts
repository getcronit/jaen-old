import {JaenPage, PageConfig} from '@snek-at/jaen'
import {generatePageOriginPath} from '@snek-at/jaen/src/utils/path'
import {GatsbyNode, Node} from 'gatsby'
import slugify from 'slugify'
import path from 'path'

import {capitalizeLastPathElement} from './helper/capitalize-last-path-element'
import {getJaenPageParentId} from './helper/get-jaen-page-parent-id'
import {readPageConfig} from './helper/page-config-reader'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = (
  {actions, loaders, stage},
  pluginOptions
) => {
  const snekResourceId = pluginOptions.snekResourceId

  if (!snekResourceId) {
    throw new Error(
      `The plugin option 'snekResourceId' is required. Please add the option to your gatsby-config.js file.`
    )
  }

  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /filerobot-image-editor/,
            use: loaders.null()
          },
          {
            test: /reagraph/,
            use: loaders.null()
          }
        ]
      }
    })
  }
}

export const createSchemaCustomization: GatsbyNode['onCreateWebpackConfig'] = ({
  actions
}) => {
  actions.createFieldExtension({
    name: 'file',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        resolve(
          source: {
            name: string
            jaenFiles: any[]
            jaenFields: Record<string, any>
            headPtr: string
            tailPtr: string
          },
          _args: any,
          context: any,
          info: any
        ) {
          const fieldName = info.fieldName
          const fieldPathKey = info.path.key

          // Throw a error if the fieldKey is the same as the fieldName
          // this is to ensure that the fieldKey is set to the correct fieldName
          // of the IMA:ImageField.
          if (fieldPathKey === info.fieldName) {
            throw new Error(
              `The fieldKey ${fieldPathKey} is the same as the fieldName ${fieldName}, please set the fieldKey to the correct fieldName of an ImageField.`
            )
          }

          const imageId =
            source.jaenFields?.['IMA:ImageField']?.[fieldPathKey]?.value
              ?.imageId

          const node = context.nodeModel.getNodeById({
            id: imageId,
            type: 'File'
          })

          return node
        }
      }
    }
  })

  actions.createFieldExtension({
    name: 'buildPath',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(
          source: Node & {
            slug: string
            parent: string | null
          },
          _args: any,
          context: any,
          _info: any
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const items = Array.from(
            (await context.nodeModel.findAll({type: `JaenPage`})).entries
          ) as any[]

          const originPath = generatePageOriginPath(
            items.map((item: {id: any; slug: any; parent: any}) => ({
              id: item.id,
              slug: item.slug,
              parent: item.parent ? {id: item.parent} : null
            })),
            {
              id: source.id,
              slug: source.slug,
              parent: source.parent
                ? {
                    id: source.parent
                  }
                : null
            }
          )

          return originPath
        }
      }
    }
  })

  actions.createFieldExtension({
    name: 'componentName',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(source: Node, _args: any, context: any, _info: any) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const items = Array.from(
            (await context.nodeModel.findAll({type: `SitePage`})).entries
          ) as any[]

          const page = items.find(
            (item: {component: string; context: {jaenPageId: string}}) =>
              item.context.jaenPageId === source.id
          )

          const sourcePages = 'src/pages'

          const componentName = page?.component?.includes(sourcePages)
            ? page.component.replace(`${sourcePages}/`, '')
            : undefined

          return componentName
        }
      }
    }
  })

  actions.createTypes(`
    type JaenWidget {
      name: String!
      data: JSON
    }

    type RemoteFileMigration {
      createdAt: Date!
      fileUrl: String!
    }

    type JaenInternal implements Node {
      finderUrl: String
      widgets: [JaenWidget!]!
      migrationHistory: [RemoteFileMigration!]!
      siteMetadata: JaenSiteMetadata
    }

    type JaenTemplate implements Node {
      id: ID!
      absolutePath: String!
      label: String!
      childTemplates: [JaenTemplate!]! @link
    }

    type JaenPage implements Node {
      id: ID!
      slug: String!
      jaenPageMetadata: JaenPageMetadata!
      jaenFields: JSON
      jaenFile: File @file
      jaenFiles: [File] @link

      sections: [JaenSection!]!

      template: String
      childTemplates: [String!]!

      buildPath: String @buildPath
      componentName: String @componentName
      excludedFromIndex: Boolean
      
    }

    type JaenSection {
      fieldName: String!
      items: [JaenSectionItem!]!
      ptrHead: String
      ptrTail: String
    }

    type JaenSectionItem {
      id: ID!
      type: String!
      ptrPrev: String
      ptrNext: String
      jaenFields: JSON
      jaenFiles: [File] @link
      jaenFile: File @file

      sections: [JaenSection!]!
    }

    type JaenSectionPath {
      fieldName: String!
      sectionId: String
    }


    type JaenPageMetadata {
      title: String!
      description: String
      image: String
      canonical: String
      datePublished: String
      isBlogPost: Boolean
    }

    type JaenSiteMetadata {
      siteUrl: String
      title: String
      description: String
      image: String
      author: JaenSiteMetadataAuthor
      organization: JaenSiteMetadataOrganization
      social: JaenSiteMetadataSocial
    }
    
    type JaenSiteMetadataAuthor {
      name: String
    }

    type JaenSiteMetadataOrganization {
      name: String
      url: String
      logo: String
    }

    type JaenSiteMetadataSocial {
      twitter: String
      fbAppID: String
    }
  `)
}

// fn to add a specifc context to the pages created by the theme
export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
  getNode,
  createContentDigest,
  store
}) => {
  const {createPage, deletePage, createNode} = actions

  const pageConfig = readPageConfig(page.component)

  // Check if the page has a `jaenPageId` in its context.
  // If not it means it's not a JaenPage and we must create one.
  if (!page.context?.jaenPageId) {
    if (!page.context?.skipJaenPage) {
      const jaenPageId = `JaenPage ${page.path}`

      const slugifiedPath = slugify(page.path)

      const existingNode = getNode(jaenPageId)

      if (!existingNode) {
        const jaenPage = {
          id: jaenPageId,
          slug: slugifiedPath,
          parent: getJaenPageParentId({
            parent: null,
            id: jaenPageId
          }),
          children: [],
          jaenPageMetadata: {
            title: pageConfig?.label || capitalizeLastPathElement(page.path),
            datePublished: new Date(page.updatedAt).toISOString()
          },
          jaenFields: null,
          jaenFiles: [],
          sections: [],
          template: null,
          childTemplates: pageConfig?.childTemplates || []
        }

        await createNode({
          ...jaenPage,
          internal: {
            type: 'JaenPage',
            content: JSON.stringify(jaenPage),
            contentDigest: createContentDigest(jaenPage)
          }
        })

        // get parent page and add the new page to its children
        const pageNode = getNode(jaenPage.id)
        const parentPageNode = jaenPage.parent ? getNode(jaenPage.parent) : null

        if (pageNode && parentPageNode) {
          actions.createParentChildLink({
            parent: parentPageNode,
            child: pageNode
          })
        }
      }

      deletePage(page)
      createPage({
        ...page,
        context: {...page.context, jaenPageId, pageConfig}
      })
    }

    console.log(store.getState().components.values())
  }
}

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  getNode,
  reporter,
  actions
}) => {
  const {createPage, createNodeField, createSlice} = actions

  const createJaenPages = async () => {
    interface QueryData {
      allTemplate: {
        nodes: Array<{
          name: string
          absolutePath: string
        }>
      }
      allJaenPage: {
        nodes: Array<
          JaenPage & {
            template: string
          }
        >
      }
    }

    const result = await graphql<QueryData>(`
      query {
        allJaenPage {
          nodes {
            id
            slug
            parent {
              id
            }
            template
            jaenPageMetadata {
              title
            }
            jaenFields
          }
        }
      }
    `)

    if (result.errors || !result.data) {
      reporter.panicOnBuild(
        `Error while running GraphQL query. ${result.errors}`
      )

      return
    }

    const {allTemplate, allJaenPage} = result.data

    for (const node of allJaenPage.nodes) {
      const pagePath = generatePageOriginPath(allJaenPage.nodes, node)

      const pureNode = getNode(node.id)

      if (pureNode) {
        createNodeField({
          node: pureNode,
          name: 'path',
          value: pagePath
        })
      }

      if (node.template) {
        if (!pagePath) {
          reporter.panicOnBuild(
            `Error while generating path for page ${node.id}`
          )
          return
        }

        const template = allTemplate.nodes.find(
          template => template.name === node.template
        )

        if (!template) {
          reporter.panicOnBuild(`Template ${node.template} not found`)
          return
        }

        createPage({
          path: pagePath,
          component: template.absolutePath,
          context: {
            jaenPageId: node.id
          }
        })
      }
    }
  }

  await createJaenPages()

  // Create JaenFrame slice

  createSlice({
    id: `jaen-frame`,
    component: path.resolve(__dirname, '../src/slices/jaen-frame.tsx')
  })
}

export const shouldOnCreateNode: GatsbyNode['shouldOnCreateNode'] = ({
  node
}) => {
  const {internal, sourceInstanceName} = node as any

  // Check if the node is a File node of instance `templates`
  if (internal.type === 'File' && sourceInstanceName === 'templates') {
    return true
  }

  return false
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
  node,
  actions,
  createContentDigest
}) => {
  // Check if the node is a File node of instance `templates`
  if (
    node.internal.type === 'File' &&
    node.sourceInstanceName === 'templates'
  ) {
    const name = node.name as string
    const absolutePath = node.absolutePath as string

    const pageConfig = readPageConfig(absolutePath)

    const templateNode = {
      id: `JaenTemplate ${name}`, // id must be unique across all nodes
      absolutePath: absolutePath,
      label: pageConfig?.label || name,
      childTemplates: pageConfig?.childTemplates || []
    }

    // Create link to other templates

    console.log('templateNode', templateNode)

    actions.createNode({
      ...templateNode,
      parent: node.id,
      internal: {
        type: 'JaenTemplate',
        content: JSON.stringify(templateNode),
        contentDigest: createContentDigest(templateNode)
      }
    })
  }
}
