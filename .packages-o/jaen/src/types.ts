import type {PageProps as GatsbyPageProps} from 'gatsby'
import type {IGatsbyImageData} from 'gatsby-plugin-image'
import {IBlockConnection} from './connectors/index.js'

export interface IWidget {
  nodes: Array<{
    name: string
    data: any
  }>
}

export interface SiteMetadata {
  title: string
  description: string
  siteUrl: string
  image: string
  author: {
    name: string
  }
  organization: {
    name: string
    url: string
    logo: string
  }
  social: {
    twitter: string // twitter username
    fbAppID: string // FB ANALYTICS
  }
}

export interface ISite {
  siteMetadata: Partial<SiteMetadata>
}

export interface IJaenTemplate {
  name: string
  label: string
  children: Array<{
    name: string
    label: string
  }>
  isRootTemplate?: boolean
}

export interface IJaenView {
  path: string
  label: string
  Icon: React.ComponentType | null
  Component: React.ComponentType
  group?: string
  hasRoutes?: boolean
}

export type IJaenFields = Record<
  string,
  Record<
    string,
    {
      position?: number
      props?: Record<string, any>
      value: any
    }
  >
> | null

export interface IJaenPage {
  id: string
  slug: string
  buildPath?: string
  jaenPageMetadata: Partial<{
    title: string
    isBlogPost: boolean
    image: string
    description: string
    datePublished: string
    canonical: string
  }>
  jaenFields: IJaenFields
  jaenFiles: Array<{
    id: string
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }>
  parent: {
    id: string
  } | null
  children: Array<{id: string} & Partial<IJaenPage>>
  sections: IJaenSection[]
  [customFieldName: string]: any

  /**
   * Unique identifier of the page component name (e.g. `JaenPageHome`).
   * - Must be unique across all pages.
   * - Used to determine the component to render.
   */
  template: string | null
  /**
   * Name of the component
   * Used for page loading
   */
  componentName?: string
  deleted?: boolean
  excludedFromIndex?: boolean
}

export interface IJaenSection {
  fieldName: string
  items: IJaenBlock[]
  ptrHead: string | null
  ptrTail: string | null
  position?: number
  props?: object
}

export interface SectionType {
  id: string
  /**
   * Position of the section inside its SectionField
   */
  position: number
  path: Array<{
    fieldName: string
    sectionId?: string
  }>
  Component?: IBlockConnection
}

export interface IJaenBlock {
  [customFieldName: string]: any
  id: string
  type: string
  ptrPrev: string | null
  ptrNext: string | null
  jaenFields: IJaenFields
  jaenFiles: Array<{
    id: string
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }>

  sections?: IJaenSection[]

  deleted?: true
}

export interface IJaenPopup {
  id: string // relative path to the notification file
  active: boolean
  jaenFields: IJaenFields
}

export interface IJaenConnection<ReactProps, Options>
  extends React.FC<ReactProps> {
  options: Options
}

export type PageProps<DataType = object, PageContextType = object> =
  GatsbyPageProps<
    DataType & {
      jaenPage: IJaenPage | null
      allJaenPage?: {nodes: Array<Partial<IJaenPage>>}
    },
    PageContextType & {jaenPageId: string}
  >

export interface IFormProps<Values> {
  values: Values
  onSubmit: (values: Values) => void
  externalValidation?: (
    valueName: keyof Values,
    value: string
  ) => string | undefined
}

export type MigrationData = Record<string, any>
