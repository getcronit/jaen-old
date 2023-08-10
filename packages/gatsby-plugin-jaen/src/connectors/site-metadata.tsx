import {
  SiteMetadata,
  SiteMetadataProvider as JaenSiteMetadataProvider
} from '@snek-at/jaen'
import {useStaticQuery, graphql} from 'gatsby'

export interface SiteMetadataProps {
  children: React.ReactNode
}

export const SiteMetadataProvider: React.FC<SiteMetadataProps> = ({
  children
}) => {
  const {jaenData} = useStaticQuery<{
    jaenData?: {
      site?: {
        siteMetadata: SiteMetadata
      }
    }
  }>(graphql`
    query {
      jaenData {
        site {
          siteMetadata {
            ...JaenSiteMetadataData
          }
        }
      }
    }
  `)

  return (
    <JaenSiteMetadataProvider siteMetadata={jaenData?.site?.siteMetadata || {}}>
      {children}
    </JaenSiteMetadataProvider>
  )
}
