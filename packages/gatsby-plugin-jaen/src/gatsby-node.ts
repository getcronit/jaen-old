import {GatsbyNode, Node} from 'gatsby'
import path from 'path'
import {
  generatePageOriginPath,
  convertToSlug,
  JaenData
} from '@snek-at/jaen/unstable-node'
import type {IJaenPage} from '@snek-at/jaen'

const jaenData = new JaenData({jaenDataDir: './jaen-data'})

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
  loaders,
  stage
}) => {
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /canvas/,
            use: loaders.null()
          },
          {
            test: /filerobot-image-editor/,
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
            jaenFields: IJaenPage['jaenFields']
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
          const items = Array.from(
            (await context.nodeModel.findAll({type: `SitePage`})).entries
          ) as any[]

          const page = items.find(
            (item: {component: string; context: {jaenPageId: string}}) =>
              item.context.jaenPageId === source.id
          )

          const sourcePages = path.resolve('./src/pages')

          const componentName = page?.component?.includes()
            ? page.component.replace(`${sourcePages}/`, sourcePages)
            : undefined

          return componentName
        }
      }
    }
  })

  actions.createTypes(`
    type JaenInternal implements Node {
      finderUrl: String
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
  `)
}

export const createPages: GatsbyNode['createPages'] = async ({actions}) => {
  const {createPage} = actions

  createPage({
    path: '/admin',
    // matchPath to ignore trailing slash
    matchPath: '/admin/*',
    component: require.resolve('../AdminPage.tsx'),
    context: {}
  })

  createPage({
    path: '/admin/login',
    component: require.resolve('../LoginPage.tsx'),
    context: {}
  })
}

export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  actions,
  page,
  createContentDigest,
  getNode
}) => {
  const {createPage, deletePage, createNode} = actions

  let stepPage = page

  const blacklist = ['/admin']

  // skip if the page is in the blacklist
  if (blacklist.includes(page.path)) {
    return
  }

  // Check if the page has a `jaenPageId` in its context.
  // If not it means it's not a JaenPage and we must create one.
  if (!page.context?.jaenPageId) {
    if (!page.context?.skipJaenPage) {
      const jaenPageId = `JaenPage ${page.path}`

      const slugifiedPath = convertToSlug(page.path)

      const existingNode = getNode(jaenPageId)

      if (!existingNode) {
        const jaenPage: IJaenPage = {
          id: jaenPageId,
          slug: slugifiedPath,
          parent: null,
          children: [],
          jaenPageMetadata: {
            title: page.path
          },
          jaenFields: null,
          jaenFiles: [],
          sections: [],
          template: null
        }

        createNode({
          ...jaenPage,
          parent: null,
          children: [],
          jaenFiles: [],
          internal: {
            type: 'JaenPage',
            content: JSON.stringify(jaenPage),
            contentDigest: createContentDigest(jaenPage)
          }
        })
      }

      stepPage = {...stepPage, context: {...page.context, jaenPageId}}

      deletePage(page)
      createPage(stepPage)
    }
  }
}

export const sourceNodes: GatsbyNode['onCreateWebpackConfig'] = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const {createNode} = actions

  const internalData = jaenData.internal || {}

  const internalNode = {
    ...internalData,
    id: createNodeId(`internal`),
    parent: null,
    children: [],
    internal: {
      type: `JaenInternal`,
      content: JSON.stringify(internalData),
      contentDigest: createContentDigest(internalData)
    }
  }

  createNode(internalNode)
}
