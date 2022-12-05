import {IJaenPage} from '../../types.js'

type PageNode = {
  id: string
  slug: string
  parent: {
    id: string
  } | null
}

export const generatePageOriginPath = (
  allNodes: Array<PageNode>,
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

export const generatePagePaths = (allNodes: IJaenPage[], pageId: string) => {
  const originNode = allNodes.find(node => node.id === pageId)

  if (originNode) {
    const paths: {[path: string]: string} = {}

    console.log(`originNode`, originNode)

    const originPath = generatePageOriginPath(allNodes, originNode!)

    console.log('originPath', originPath)

    const lookupPath = (node: IJaenPage, pathPrefix = '/') => {
      paths[pathPrefix] = node.id

      if (node.children.length) {
        for (const {id} of node.children) {
          const child = allNodes.find(n => n.id === id)

          if (child) {
            lookupPath(
              child,
              pathPrefix !== '/'
                ? `${pathPrefix}/${child.slug}`
                : `/${child.slug}`
            )
          }
        }
      }
    }

    lookupPath(originNode, originPath)

    return paths
  } else {
    throw new Error('Could not generate paths for page with id: ' + pageId)
  }
}

export const generateAllPaths = (allNodes: IJaenPage[]) => {
  const paths: {[path: string]: string} = {}

  for (const node of allNodes) {
    const path = generatePageOriginPath(allNodes, node)

    if (path) {
      paths[path] = node.id
    }
  }

  return paths
}

export const matchPath = (path1: string, path2: string) => {
  // normalize and compare
  const p1 = path1.replace(/\/$/, '')
  const p2 = path2.replace(/\/$/, '')

  return p1 === p2
}
