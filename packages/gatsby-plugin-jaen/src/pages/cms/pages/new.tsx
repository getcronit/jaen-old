import {useLocation} from '@reach/router'
import {PageConfig, useNotificationsContext} from '@snek-at/jaen'
import {navigate, PageProps} from 'gatsby'
import {useEffect, useMemo, useState} from 'react'

import {New} from '../../../components/cms/Pages/New'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {
  CMSManagement,
  useCMSManagement
} from '../../../connectors/cms-management'

const PagesNew: React.FC = () => {
  const {toast} = useNotificationsContext()
  const manager = useCMSManagement()

  const parentPages = useMemo(() => {
    const pages = manager.pages()

    const _parentPages: {
      [pageId: string]: {
        label: string
        templates: {
          [templateId: string]: {
            label: string
          }
        }
      }
    } = {}

    for (const page of pages) {
      const pageTemplates = manager.templatesForPage(page.id)

      if (pageTemplates.length > 0) {
        _parentPages[page.id] = {
          label: page.jaenPageMetadata.title || page.slug,
          templates: pageTemplates.reduce((acc, template) => {
            acc[template.id] = {
              label: template.label
            }

            return acc
          }, {} as {[key: string]: {label: string}})
        }
      }
    }

    return _parentPages
  }, [])

  const location = useLocation()

  const [defaultParentPageId, setDefaultParentPageId] = useState<
    string | undefined
  >(undefined)

  useEffect(() => {
    try {
      const pageId = atob(location.hash.replace('#', ''))

      if (parentPages[pageId]) {
        setDefaultParentPageId(pageId)
      }
    } catch (e) {
      console.error(e)
    }
  }, [location.hash, parentPages])

  return (
    <JaenPageLayout layout="form">
      <New
        form={{
          values: {
            parent: defaultParentPageId
          },
          parentPages,
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
}

const Page: React.FC<PageProps> = () => {
  return (
    <CMSManagement>
      <PagesNew />
    </CMSManagement>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'New',
  breadcrumbs: [
    {
      label: 'CMS',
      path: '/cms/'
    },
    {
      label: 'Pages',
      path: '/cms/pages/'
    },
    {
      label: 'New',
      path: '/cms/pages/new/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isRequired: true
  },
  theme: 'jaen'
}