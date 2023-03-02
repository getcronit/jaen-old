import fs from 'fs'
import {GatsbyNode, Node} from 'gatsby'
import {convertToSlug, generatePageOriginPath, JaenSource} from 'jaen-utils'
import path from 'path'

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = async ({
  reporter
}) => {
  await checkSourceFolder(JaenSource.sourcePagesPath)
  await checkSourceFolder(JaenSource.sourceTemplatesPath)

  async function checkSourceFolder(sourcePath: string | null) {
    if (sourcePath) {
      reporter.info(`Found jaen-pages at ${sourcePath}`)

      // loop through all pages at pagesPath dir
      const dir = await fs.promises.opendir(sourcePath)

      for await (const dirent of dir) {
        if (
          dirent.isFile() &&
          ['.tsx', '.ts', '.js', '.jsx'].includes(path.extname(dirent.name))
        ) {
          const pagePath = path.join(sourcePath, dirent.name)
          // import as text
          const moduleText = await fs.promises.readFile(pagePath, 'utf8')

          // check if moduleText contains a graphql export
          if (!moduleText.includes('export const query = graphql`')) {
            reporter.warn(
              `The page ${pagePath} does not contain a graphql export.\n` +
                `Note: The graphql export must be in the form of 'export const query = graphql' and must contain the correct graphql query for jaen pages.`
            )
          }
        }
      }
    }
  }
}

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = (
  {actions, loaders, plugins, stage},
  pluginOptions
) => {
  const snekResourceId = pluginOptions.snekResourceId

  if (!snekResourceId) {
    throw new Error(
      `The plugin option 'snekResourceId' is required. Please add the option to your gatsby-config.js file.`
    )
  }

  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        ___JAEN_SOURCE_TEMPLATES___: JSON.stringify(
          JaenSource.sourceTemplatesPath
        ),
        ___JAEN_SOURCE_PAGES___: JSON.stringify(JaenSource.sourcePagesPath),
        ___JAEN_SOURCE_VIEWS___: JSON.stringify(JaenSource.sourceViewsPath),
        ___JAEN_SOURCE_POPUPS___: JSON.stringify(JaenSource.sourcePopupsPath),
        ___SNEK_RESOURCE_ID___: JSON.stringify(snekResourceId)
      })
    ]
  })

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

          const sourcePages = JaenSource.sourcePagesPath

          console.log(`sourcePages`, sourcePages)
          console.log(page.component)

          const componentName = page?.component?.includes(sourcePages)
            ? page.component.replace(`${sourcePages}/`, '')
            : undefined

          console.log(`componentName`, componentName)

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

    type JaenPopup implements Node {
      id: ID!
      jaenFields: JSON
      active: Boolean
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

  createPage({
    path: '/r',
    matchPath: '/r/*',
    component: require.resolve('../RoutingPage.tsx'),
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
        const jaenPage = {
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

        await createNode({
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

  JaenSource.jaenData.read()

  const internalData = JaenSource.jaenData.internal || {}

  console.log(`internalData`, internalData)

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

  await createNode(internalNode)
}
