import {CMSManagementProvider, IJaenPage} from '@snek-at/jaen'
import {graphql, useStaticQuery} from 'gatsby'

export {useCMSManagementContext as useCMSManagement} from '@snek-at/jaen'

export interface CMSManagementProps {
  children: React.ReactNode
}

export const CMSManagement: React.FC<CMSManagementProps> = props => {
  const staticData = useStaticQuery<{
    allJaenPage: {
      nodes: IJaenPage[]
    }
  }>(graphql`
    query CMSManagementData {
      allJaenPage {
        nodes {
          ...JaenPageData
        }
      }
    }
  `)

  return (
    <CMSManagementProvider staticPages={staticData.allJaenPage.nodes}>
      {props.children}
    </CMSManagementProvider>
  )
}
