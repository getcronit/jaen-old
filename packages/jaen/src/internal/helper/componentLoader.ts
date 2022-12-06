import {ITemplateConnection, IPageConnection} from '../../connectors/index.js'

export const templateLoader = async (
  relativePath: string
): Promise<ITemplateConnection> => {
  //@ts-ignore
  return (await import(`${___JAEN_SOURCE_TEMPLATES___}/${relativePath}`))
    .default
}

export const pageLoader = async (
  relativePath: string
): Promise<IPageConnection> => {
  //@ts-ignore
  return (await import(`${___JAEN_SOURCE_PAGES___}/${relativePath}`)).default
}
