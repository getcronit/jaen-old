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
  const {jaenInternal} = useStaticQuery<{
    jaenInternal?: {
      siteMetadata: SiteMetadata
    }
  }>(graphql`
    query {
      jaenInternal {
        siteMetadata {
          ...JaenSiteMetadataData
        }
      }
    }
  `)

  return (
    <JaenSiteMetadataProvider siteMetadata={jaenInternal?.siteMetadata || {}}>
      {children}
    </JaenSiteMetadataProvider>
  )
}
