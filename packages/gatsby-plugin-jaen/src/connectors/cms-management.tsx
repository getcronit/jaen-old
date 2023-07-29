import {CMSManagementProvider, JaenPage, JaenTemplate} from '@snek-at/jaen'
import {graphql, useStaticQuery} from 'gatsby'

export {useCMSManagementContext as useCMSManagement} from '@snek-at/jaen'

export interface CMSManagementProps {
  children: React.ReactNode
}

export const CMSManagement: React.FC<CMSManagementProps> = props => {
  const staticData = useStaticQuery<{
    allJaenPage: {
      nodes: JaenPage[]
    }
    allJaenTemplate: {
      nodes: JaenTemplate[]
    }
  }>(graphql`
    query CMSManagementData {
      allJaenPage {
        nodes {
          ...JaenPageData
        }
      }
      allJaenTemplate {
        nodes {
          ...JaenTemplateData
        }
      }
    }
  `)

  return (
    <CMSManagementProvider
      staticPages={staticData.allJaenPage.nodes}
      templates={staticData.allJaenTemplate.nodes}>
      {props.children}
    </CMSManagementProvider>
  )
}
