export declare const useAdminStaticQuery: <JaenPageNode>() => {
  jaenInternal: {
    finderUrl: string | null
  }
  allJaenPage: {
    nodes: JaenPageNode[]
  }
  jaenTemplate: {
    nodes: Array<{
      name: string
      relativePath: string
    }>
  }
}
