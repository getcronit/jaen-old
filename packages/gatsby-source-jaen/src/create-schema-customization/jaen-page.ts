import {CreateSchemaCustomizationArgs, Node} from 'gatsby'

export const createSchemaCustomization = async ({
  actions
}: CreateSchemaCustomizationArgs) => {
  actions.createTypes(`
    type JaenPage implements Node {
      id: ID!
      slug: String!
      jaenPageMetadata: JaenPageMetadata!
      jaenFields: JSON
      jaenFile: MediaNode
      jaenFiles: [MediaNode] @link

      sections: [JaenSection!]!

      template: String
      childTemplates: [String!]!

      buildPath: String @buildPath
      excludedFromIndex: Boolean
      
      pageConfig: JSON

      parentPage: JaenPage @link      
      childPages: [JaenPage!]! @childPages
    }

    type MediaNode implements Node {
        id: ID!
        description: String!
        node: File! @file
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
      jaenFile: MediaNode
      jaenFiles: [MediaNode] @link

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
      blogPost: JaenPageMetadataBlogPost
    }

    type JaenPageMetadataBlogPost {
      date: String
      author: String
      category: String
    }
  `)

  actions.createFieldExtension({
    name: 'buildPath',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(
          source: Node & {
            slug: string
            parentPage: string | null
          },
          _args: any,
          context: any,
          _info: any
        ) {
          const {entries} = await context.nodeModel.findAll({
            type: 'SitePage'
          })

          for (const entry of entries) {
            if (source.id === entry.context.jaenPageId) {
              return entry.path
            }
          }
        }
      }
    }
  })

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
    name: 'childPages',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(
          source: Node & {
            slug: string
            parentPage: string | null
          },
          _args: any,
          context: any,
          _info: any
        ) {
          const {entries} = await context.nodeModel.findAll({
            type: 'JaenPage',
            query: {
              filter: {
                parentPage: {
                  eq: source.id
                }
              }
            }
          })

          return entries
        }
      }
    }
  })
}
