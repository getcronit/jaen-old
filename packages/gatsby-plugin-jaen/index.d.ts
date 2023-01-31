export declare const useAdminStaticQuery: <JaenSite, JaenPageNode>() => {
  site: JaenSite
  jaenInternal: {
    finderUrl: string | null
    migrationHistory: Array<{
      createdAt: string
      fileUrl: string
    }>
  }
  allJaenPage: {
    totalCount: number
    nodes: JaenPageNode[]
  }
  allJaenPopup: {
    totalCount: number
    nodes: Array<{
      id: string
      active: boolean
      jaenFields: object
    }>
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

export declare const useWidgetStaticQuery: () => {
  jaenInternal: {
    widgets: Array<{
      name: string
      data: object
    }>
  }
}
