import {HeadProps} from 'gatsby'
// import {useSiteMetadata} from 'gatsby-plugin-jaen/hooks/useSiteMetadata'
import {getSchemaOrg} from './getSchemaOrg.js'

// author, siteUrl, datePublished, defaultTitle, description, image, isBlogPost, organization, title, url

export const Head: React.FC<
  HeadProps<{page: Record<string, any> | null}> & {
    children?: React.ReactNode
  }
> = props => {
  const siteMetadata = {} as any // useSiteMetadata()

  const defaultTitle = props.location.pathname

  let title: string

  if (props.location.pathname === '/') {
    title = siteMetadata?.title || defaultTitle
  } else {
    title = props.data.page?.jaenPageMetadata?.title || defaultTitle
  }

  const description =
    props.data.page?.jaenPageMetadata?.description || siteMetadata?.description
  const image = props.data.page?.jaenPageMetadata?.image || siteMetadata?.image
  const url = `${siteMetadata?.siteUrl}${props.location.pathname}`
  const isBlogPost = props.data.page?.jaenPageMetadata?.isBlogPost || false
  const datePublished =
    props.data.page?.jaenPageMetadata?.datePublished || false
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
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <link rel="canonical" href={url} />
      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {isBlogPost ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="fb:app_id" content={fbAppID} />
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* Schema.org tags */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSON)}
      </script>
      {props.children}
    </>
  )
}
