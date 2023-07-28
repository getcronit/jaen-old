import {navigate, PageProps} from 'gatsby'

import {New, NewProps} from '../../../components/cms/Pages/New'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../theme/with-theme'
import {
  CMSManagement,
  useCMSManagement
} from '../../../connectors/cms-management'
import {useMemo} from 'react'
import {useNotificationsContext} from '@snek-at/jaen'

const PagesNew: React.FC = withTheme(() => {
  const {toast} = useNotificationsContext()
  const manager = useCMSManagement()

  const parentPages = useMemo(() => {
    const pages = manager.pages()

    return pages.reduce<NewProps['form']['parentPages']>((acc, page) => {
      acc[page.id] = {
        label: page.jaenPageMetadata.title || page.id
      }

      return acc
    }, {})
  }, [])

  return (
    <JaenPageLayout layout="form">
      <New
        form={{
          parentPages,
          templates: {
            Example: {
              label: 'Example'
            }
          },
          onSubmit: data => {
            const addedPageId = manager.addPage({
              slug: data.slug,
              template: data.template,
              parent: {
                id: data.parent
              },
              excludedFromIndex: data.isExcludedFromIndex,
              jaenPageMetadata: {
                title: data.title,
                image: data.image?.useImage ? data.image.src : undefined,
                description: data.description,
                isBlogPost: data.blogPost?.isBlogPost,
                datePublished: data.blogPost?.date
              }
            })

            toast({
              title: 'Page created',
              description: `Page ${data.title} has been created`,
              status: 'success'
            })

            navigate(`/cms/pages/#${btoa(addedPageId)}`)
          }
        }}
      />
    </JaenPageLayout>
  )
})

const Page: React.FC<PageProps> = () => {
  return (
    <CMSManagement>
      <PagesNew />
    </CMSManagement>
  )
}

export default Page
