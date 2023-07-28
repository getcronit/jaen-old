import {navigate, PageProps} from 'gatsby'
import {useLocation} from '@reach/router'

import {Pages} from '../../../components/cms/Pages/Pages'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../theme/with-theme'
import {
  CMSManagement,
  useCMSManagement
} from '../../../connectors/cms-management'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useNotificationsContext} from '@snek-at/jaen'

const PagesPage: React.FC = withTheme(() => {
  const {toast} = useNotificationsContext()
  const manager = useCMSManagement()

  const [currentPageId, setCurrentPageId] = useState<string | undefined>(
    undefined
  )

  const currentPage = manager.usePage(currentPageId)

  const location = useLocation()

  useEffect(() => {
    try {
      const pageId = atob(location.hash.replace('#', ''))

      setCurrentPageId(pageId || undefined)
    } catch (e) {
      console.error(e)
    }
  }, [location.hash])

  // useEffect(() => {
  //  // check if location is
  // }, [currentPage, location.hash])

  const children = useMemo(() => {
    const pages = manager.pages(currentPage.id)

    console.log('Child pages', pages, currentPage.id)

    return pages.map(p => {
      return {
        id: p.id,
        title: p.jaenPageMetadata.title || 'No title',
        description: p.jaenPageMetadata.description || 'No description',
        publishedDate: p.jaenPageMetadata.datePublished || ''
        // author: 'Nico Schett'
      }
    })
  }, [currentPage.id])

  const handleTreeSelect = useCallback(
    (id: string) => {
      setCurrentPageId(id || undefined)

      if (id) {
        navigate(`#${btoa(id)}`)
      } else {
        navigate('#')
      }
    },
    [manager]
  )

  return (
    <JaenPageLayout>
      <Pages
        pageId={currentPage.id}
        form={{
          values: {
            title: currentPage.jaenPageMetadata?.title || 'No title',
            slug: currentPage.slug,
            template: currentPage.template,
            description:
              currentPage.jaenPageMetadata.description || 'No description',
            parent: currentPage.parent?.id,
            isExcludedFromIndex: currentPage.excludedFromIndex
          },
          templates: currentPage.template
            ? {
                [currentPage.template]: {
                  label: currentPage.template
                }
              }
            : {},
          parentPages: currentPage.parent?.id
            ? {
                [currentPage.parent.id || '']: {
                  label:
                    manager.page(currentPage.parent.id).jaenPageMetadata
                      ?.title || 'No parent'
                }
              }
            : {},
          onSubmit: data => {
            manager.updatePage(currentPage.id, {
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
              title: 'Page updated',
              description: `Page ${data.title} has been updated`,
              status: 'success'
            })
          }
        }}
        children={children}
        tree={manager.tree}
        onTreeSelect={handleTreeSelect}
      />
    </JaenPageLayout>
  )
})

const Page: React.FC<PageProps> = () => {
  return (
    <CMSManagement>
      <PagesPage />
    </CMSManagement>
  )
}

export default Page
