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
  jaenView: {
    nodes: Array<{
      name: string
      relativePath: string
    }>
  }
}

export declare const usePopupStaticQuery: () => {
  jaenPopup: {
    nodes: Array<{
      name: string
      relativePath: string
    }>
  }
  allJaenPopup: {
    nodes: Array<{
      id: string
      active: boolean
      jaenFields: object
    }>
  }
}
