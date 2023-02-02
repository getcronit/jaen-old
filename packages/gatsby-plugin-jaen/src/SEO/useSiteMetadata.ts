import {SiteMetadata} from '@snek-at/jaen'
import {graphql, useStaticQuery} from 'gatsby'

export const useSiteMetadata = () => {
  let staticData

  try {
    staticData = useStaticQuery<{
      jaenInternal: {
        siteMetadata?: SiteMetadata
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
  } catch (e) {
    staticData = {
      jaenInternal: {}
    }
  }

  return staticData.jaenInternal.siteMetadata
}
