import type {
  IJaenFields,
  IJaenPage,
  IJaenSection
} from 'jaen/dist/types.js'

import {Reporter, Store} from 'gatsby'
import {IGatsbyImageData} from 'gatsby-plugin-image'
import {
  createRemoteFileNode,
  CreateRemoteFileNodeArgs
} from 'gatsby-source-filesystem'

export interface IProcessGatbsy {
  createNode: CreateRemoteFileNodeArgs['createNode']
  createNodeId: CreateRemoteFileNodeArgs['createNodeId']
  cache: CreateRemoteFileNodeArgs['cache']
  store: Store
  reporter: Reporter
}

export const processPage = async ({
  page,
  ...rest
}: {page: IJaenPage} & IProcessGatbsy): Promise<void> => {
  // process jaenFields of page if not null
  if (page.jaenFields) {
    for (const [type, field] of Object.entries(page.jaenFields)) {
      await processIMAtoNodes({
        node: page,
        type,
        field,
        ...rest
      })
    }
  }

  page.sections = page.sections || []

  await processSections({
    sections: page.sections,
    ...rest
  })

  // @ts-ignore
  page.jaenFiles = page.jaenFiles || []
}

export const processSections = async ({
  sections,
  ...rest
}: {sections: IJaenSection[]} & IProcessGatbsy): Promise<void> => {
  // process jaenFields of page if not null

  for (const section of sections) {
    for (const item of section.items) {
      if (item.jaenFields) {
        for (const [type, field] of Object.entries(item.jaenFields)) {
          await processIMAtoNodes({
            node: item,
            type,
            field,
            ...rest
          })
        }
      }

      item.sections = item.sections || []

      await processSections({
        sections: item.sections,
        ...rest
      })
    }
  }
}

export interface IProcessIMAtoNodes extends IProcessGatbsy {
  node: {
    id: string
    jaenFields: IJaenFields
    jaenFiles: Array<{
      id: string
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }>
  }
  type: string
  field: NonNullable<IJaenPage['jaenFields']>['string']
}

export const processIMAtoNodes = async ({
  node,
  type,
  field,
  ...rest
}: IProcessIMAtoNodes): Promise<void> => {
  const createJaenFile = async (url: string) => {
    const fileNode = await createRemoteFileNode({
      url,
      parentNodeId: node.id,
      ...rest
    })

    const fileNodeId = fileNode.id

    if (!node.jaenFiles) {
      node.jaenFiles = []
    }

    // @ts-expect-error
    node.jaenFiles.push(fileNodeId)

    return fileNodeId
  }

  switch (type) {
    case 'IMA:ImageField':
      for (const [name, v] of Object.entries(field)) {
        try {
          if (v.value) {
            const {internalImageUrl} = v.value as {internalImageUrl: string}

            console.log('iamProcess', name, type, internalImageUrl)

            if (internalImageUrl) {
              const fileNodeId = await createJaenFile(internalImageUrl)

              v.value.imageId = fileNodeId
            }
          }
        } catch (error) {
          console.error(`${name} is not a valid IMA field`, error)
        }
      }
      break
    // case 'IMA:MdxField':
    //   for (const [name, v] of Object.entries(field)) {
    //     try {
    //       const value = v.value as {
    //         children: Array<{
    //           type: string
    //           name: string
    //           attributes: Array<{
    //             name: string
    //             type: string
    //             value: string
    //           }>
    //         }>
    //       }

    //       // get all image nodes (type: mdxJsxFlowElement, name: Image)
    //       const imageNodes = value.children.filter(
    //         node => node.type === 'mdxJsxFlowElement' && node.name === 'Image'
    //       )

    //       for (const imageNode of imageNodes) {
    //         const srcAttri = imageNode.attributes.find(
    //           attri => attri.name === 'src' && attri.type === 'mdxJsxAttribute'
    //         )

    //         if (srcAttri) {
    //           const src = srcAttri.value

    //           if (src) {
    //             await createJaenFile(src)
    //           }
    //         }
    //       }
    //     } catch (error) {
    //       console.error(`${name} is not a valid IMA field`, error)
    //     }
    //   }

    //   break

    default:
      break
  }
}
