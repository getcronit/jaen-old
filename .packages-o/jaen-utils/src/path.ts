export function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

interface PageNode {
  id: string
  slug: string
  parent: {
    id: string
  } | null
}

export const generatePageOriginPath = (
  allNodes: PageNode[],
  node: PageNode,
  path = node.id === 'JaenPage /' ? '/' : `/${node.slug}`
): string | undefined => {
  const parentId = node.parent?.id
  const parent = allNodes.find(n => n.id === parentId)

  if (parent) {
    return generatePageOriginPath(
      allNodes,
      parent,
      parent.slug ? `/${parent.slug}${path}` : path
    )
  }

  // with trailing slash
  const normalizedPath = path.endsWith('/') ? path : `${path}/`

  return normalizedPath
}
