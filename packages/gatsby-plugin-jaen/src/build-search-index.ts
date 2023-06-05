import slugify from '@sindresorhus/slugify'
import {IJaenPage} from '@snek-at/jaen/dist/types.js'
import {generatePageOriginPath} from 'jaen-utils'
import {SearchIndex} from './gatsby-node'

export const buildSearchIndex = async (nodes: IJaenPage[]) => {
  const searchIndex: SearchIndex = {}

  for (const node of nodes) {
    const pagePath = generatePageOriginPath(nodes, node)

    if (!pagePath) {
      continue
    }

    const title = node.jaenPageMetadata?.title || pagePath

    let data: SearchIndex[string]['data'] = {
      '': ''
    }

    if (node.jaenFields) {
      const mdxField = node.jaenFields['IMA:MdxField']
      const textField = node.jaenFields['IMA:TextField']

      if (mdxField) {
        let currentHeading: string | null = null

        const duplicationRecord: Record<string, number> = {}

        const buildHeading = (value: string) => {
          let slug = slugify(value)

          if (duplicationRecord[slug]) {
            slug += `-${duplicationRecord[slug]}`
            duplicationRecord[slug] += 1
          } else {
            duplicationRecord[slug] = 1
          }

          return `${slug}#${value}`
        }
        for (const [_, value] of Object.entries(mdxField)) {
          const mdast = value.value

          // const headings: string[] = []
          for (const node of mdast.children) {
            if (node.type === 'heading') {
              // Set current heading key e.g. (some-anchor#Some Anchor)
              // @ts-ignore
              const value = node.children[0]?.value as string

              currentHeading = buildHeading(value)

              data[currentHeading] = ''
            } else if (node.type === 'paragraph') {
              // Add paragraph to current heading
              // @ts-ignore
              const value = node.children[0]?.value as string

              if (currentHeading) {
                data[currentHeading] += `${value}\n`
              } else {
                // Append to path: ""
                data[''] += `${value}\n`
              }
            }
          }
        }
      }

      if (textField) {
        for (const [key, value] of Object.entries(textField)) {
          console.log(`key`, key, value)

          const isHeading =
            value.props?.as &&
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value.props.as)

          const id = value.props?.id

          const relatedName = value.props?.relatedName

          if (isHeading && id) {
            data[`${id}#${value.value || ''}`] = ''
          } else if (relatedName) {
            const realtedField = textField[relatedName]

            if (realtedField) {
              const relatedId = realtedField.props?.id
              const relatedValue = realtedField.value

              if (relatedId) {
                data[`${relatedId}#${relatedValue}`] += `${value.value}\n`
              }
            }
          }
        }
      }
    }

    searchIndex[pagePath] = {
      title,
      data
    }
  }

  return searchIndex
}
