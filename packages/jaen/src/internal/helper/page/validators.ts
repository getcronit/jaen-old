import {IJaenPage} from '../../../types.js'

export function pageUpdateValidation({
  name,
  value,
  parentId,
  pageTree
}: {
  name: string
  value: string
  parentId: string | null | undefined
  pageTree: IJaenPage[]
}) {
  if (name === 'slug') {
    const siblings = []

    if (parentId) {
      const parentPage = pageTree.find(p => p.id === parentId)

      if (parentPage) {
        for (const child of parentPage.children) {
          siblings.push(child.id)
        }
      }
    } else {
      for (const page of pageTree) {
        if (page.parent == null) {
          siblings.push(page.id)
        }
      }
    }

    const slugTaken = siblings.some(siblingId => {
      const sibling = pageTree.find(p => p.id === siblingId)

      if (sibling) {
        // // check if sibling is deleted
        // if (sibling.deleted) {
        //   return false
        // }

        return sibling.slug === value
      }

      return false
    })

    if (slugTaken) {
      return 'Slug is already taken'
    }
  }
  return ''
}
