import {
  IPageConnection,
  ITemplateConnection,
  IViewConnection
} from '../../connectors/index.js'

export const templateLoader = async (
  relativePath: string
): Promise<ITemplateConnection> => {
  // @ts-expect-error
  return (await import(`${___JAEN_SOURCE_TEMPLATES___}/${relativePath}`))
    .default
}

export const pageLoader = async (
  relativePath: string
): Promise<IPageConnection> => {
  // @ts-expect-error
  return (await import(`${___JAEN_SOURCE_PAGES___}/${relativePath}`)).default
}

export const viewLoader = async (
  relativePath: string
): Promise<IViewConnection> => {
  // @ts-expect-error
  return (await import(`${___JAEN_SOURCE_VIEWS___}/${relativePath}`)).default
}
