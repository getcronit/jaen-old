import type {IJaenPage} from '@snek-at/jaen'
import {generatePageOriginPath} from '@snek-at/jaen/src/utils/path'

import {GatsbyNode, Node} from 'gatsby'
import slugify from 'slugify'

function getParentId(page: {parent: {id: string} | null; id: string}) {
  if (page.parent) {
    return page.parent.id
  }

  if (page.id === 'JaenPage /') {
    return null
  }

  return 'JaenPage /'
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

// fn to add a specifc context to the pages created by the theme
export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
  getNode,
  createContentDigest
}) => {
  const {createPage, deletePage, createNode} = actions

  const jaenPages = [
    {
      path: '/login',
      context: {
        withoutJaenFrame: true
      }
    },
    {
      path: '/logout',
      context: {
        withoutJaenFrame: true
      }
    },
    {
      path: '/cms',
      context: {
        withoutJaenFrameStickyHeader: true,
        breadcrumbs: [
          {
            label: 'CMS',
            path: '/cms'
          }
        ]
      }
    },
    {
      path: '/cms/pages',
      context: {
        withoutJaenFrameStickyHeader: true,
        breadcrumbs: [
          {
            label: 'CMS',
            path: '/cms'
          },
          {
            label: 'Pages',
            path: '/cms/pages'
          }
        ]
      }
    },
    {
      path: '/cms/pages/new',
      context: {
        withoutJaenFrameStickyHeader: true,
        breadcrumbs: [
          {
            label: 'CMS',
            path: '/cms'
          },
          {
            label: 'Pages',
            path: '/cms/pages'
          },
          {
            label: 'New',
            path: '/cms/pages/new'
          }
        ]
      }
    },
    {
      path: '/cms/settings',
      context: {
        withoutJaenFrameStickyHeader: true,
        breadcrumbs: [
          {
            label: 'CMS',
            path: '/cms'
          },
          {
            label: 'Settings',
            path: '/cms/settings'
          }
        ]
      }
    },
    {
      path: '/cms/media',
      context: {
        withoutJaenFrameStickyHeader: true,
        breadcrumbs: [
          {
            label: 'CMS',
            path: '/cms'
          },
          {
            label: 'Media',
            path: '/cms/media'
          }
        ]
      }
    }
  ]

  const jaenPage = jaenPages.find(jaenPage => {
    // match regardless of trailing slash

    const a = page.path.replace(/\/$/, '')
    const b = jaenPage.path.replace(/\/$/, '')

    return a === b
  })

  if (jaenPage) {
    deletePage(page)
    createPage({
      ...page,
      context: {
        ...page.context,
        ...jaenPage.context
      }
    })
  }

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
          parent: getParentId({
            parent: null,
            id: jaenPageId
          }),
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
          internal: {
            type: 'JaenPage',
            content: JSON.stringify(jaenPage),
            contentDigest: createContentDigest(jaenPage)
          }
        })

        console.log(`Created JaenPage ${jaenPageId}`)

        // get parent page and add the new page to its children
        const pageNode = getNode(jaenPage.id)
        const parentPageNode = jaenPage.parent ? getNode(jaenPage.parent) : null

        console.log(
          `Trying to create parent-child link between`,
          pageNode?.id,
          parentPageNode?.id
        )

        if (pageNode && parentPageNode) {
          console.log(
            `Creating parent-child link between`,
            pageNode.id,
            parentPageNode.id
          )
          actions.createParentChildLink({
            parent: parentPageNode,
            child: pageNode
          })
        }
      } else {
        const parentNode = existingNode.parent
          ? getNode(existingNode.parent)
          : null

        if (parentNode && existingNode) {
          console.log(
            `Establishing parent-child link between`,
            existingNode.id,
            parentNode.id
          )
          // actions.createParentChildLink({
          //   parent: parentNode,
          //   child: existingNode
          // })
        }
      }

      deletePage(page)
      createPage({...page, context: {...page.context, jaenPageId}})
    }
  }
}

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  getNode,
  reporter,
  actions
}) => {
  const {createPage, createNodeField} = actions

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
          IJaenPage & {
            template: string
          }
        >
      }
    }

    const result = await graphql<QueryData>(`
      query {
        allTemplate: allFile(
          filter: {sourceInstanceName: {eq: "jaen-templates"}}
        ) {
          nodes {
            name
            absolutePath
          }
        }
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
}
