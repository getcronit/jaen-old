import {HeadProps} from 'gatsby'
import {useSiteMetadata} from 'gatsby-plugin-jaen/hooks/useSiteMetadata'
import {getSchemaOrg} from './getSchemaOrg.js'

// author, siteUrl, datePublished, defaultTitle, description, image, isBlogPost, organization, title, url

export const Head: React.FC<
  HeadProps<{jaenPage?: Record<string, any>}> & {
    children?: React.ReactNode
  }
> = props => {
  const siteMetadata = useSiteMetadata()

  const defaultTitle = props.location.pathname

  const title: string =
    props.data.jaenPage?.jaenPageMetadata?.title ||
    siteMetadata?.title ||
    defaultTitle

  const description =
    props.data.jaenPage?.jaenPageMetadata?.description ||
    siteMetadata?.description
  const image =
    props.data.jaenPage?.jaenPageMetadata?.image || siteMetadata?.image
  const url = `${siteMetadata?.siteUrl}${props.location.pathname}`
  const isBlogPost = props.data.jaenPage?.jaenPageMetadata?.isBlogPost || false
  const datePublished =
    props.data.jaenPage?.jaenPageMetadata?.datePublished || false
  const fbAppID = siteMetadata?.social?.fbAppID
  const twitter = siteMetadata?.social?.twitter

  const schemaOrgJSON = getSchemaOrg({
    author: siteMetadata?.author,
    datePublished,
    defaultTitle,
    description: description || '',
    image: image || '',
    isBlogPost,
    organization: siteMetadata?.organization,
    title,
    siteUrl: siteMetadata?.siteUrl || '',
    url
  })

  return (
    <>
      <title id="title">{title}</title>
      <meta id="meta-description" name="description" content={description} />
      <meta id="meta-image" name="image" content={image} />
      <link id="canonical-link" rel="canonical" href={url} />

      {/* OpenGraph tags */}
      <meta id="og-url" property="og:url" content={url} />
      {isBlogPost ? (
        <meta id="og-type" property="og:type" content="article" />
      ) : null}
      <meta id="og-title" property="og:title" content={title} />
      <meta
        id="og-description"
        property="og:description"
        content={description}
      />
      <meta id="og-image" property="og:image" content={image} />
      <meta id="fb-app-id" property="fb:app_id" content={fbAppID} />

      {/* Twitter Card tags */}
      <meta
        id="twitter-card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta id="twitter-creator" name="twitter:creator" content={twitter} />
      <meta id="twitter-title" name="twitter:title" content={title} />
      <meta
        id="twitter-description"
        name="twitter:description"
        content={description}
      />
      <meta id="twitter-image" name="twitter:image" content={image} />

      {/* Schema.org tags */}
      <script id="schema-org" type="application/ld+json">
        {JSON.stringify(schemaOrgJSON)}
      </script>

      {props.children}
    </>
  )
}
