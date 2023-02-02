export declare const useAdminStaticQuery: <
  JaenSiteMetadata,
  JaenPageNode
>() => {
  jaenInternal: {
    finderUrl: string | null
    migrationHistory: Array<{
      createdAt: string
      fileUrl: string
    }>
    siteMetadata: Partial<JaenSiteMetadata>
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

export {Head} from './dist/Head'
