import {navigate, PageProps} from 'gatsby'
import {useLocation} from '@reach/router'

import {Pages} from '../../../components/cms/Pages/Pages'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {
  CMSManagement,
  useCMSManagement
} from '../../../connectors/cms-management'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {PageConfig, useNotificationsContext} from '@snek-at/jaen'

const PagesPage: React.FC = () => {
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
        createdAt: p.createdAt,
        modifiedAt: p.modifiedAt
        // author: 'Nico Schett'
      }
    })
  }, [currentPage.id, manager.pages])

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

  // const parentPages = useMemo(() => {
  //   if (!currentPage.parent?.id) return {}

  //   const parentPage = manager.page(currentPage.parent.id)

  //   return {
  //     [currentPage.parent.id]: {
  //       label: parentPage.jaenPageMetadata?.title || parentPage.slug,
  //       templates: manager
  //         .templatesForPage(currentPage.parent.id)
  //         .reduce((acc, template) => {
  //           acc[template.id] = {
  //             label: template.label
  //           }

  //           return acc
  //         }, {} as {[key: string]: {label: string}})
  //     }
  //   }
  // }, [currentPage.parent?.id, manager])

  const parentPages = useMemo(() => {
    const pages = manager.pages()

    // use the manager.tree to blacklist all children of current page
    const blacklist: string[] = []

    const recursiveBlacklist = (pageId?: string) => {
      if (!pageId) return

      const page = manager.page(pageId)

      if (!page) return

      for (const child of page.children) {
        blacklist.push(child.id)
        recursiveBlacklist(child.id)
      }
    }

    recursiveBlacklist(currentPage.id)

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
      // skip if page is current page
      if (page.id === currentPage.id) {
        continue
      }

      // skip if page is in blacklist
      if (blacklist.includes(page.id)) {
        continue
      }

      const pageTemplates = manager.templatesForPage(page.id)

      if (pageTemplates.length > 0) {
        // skip if pageTemplates do not contain current page template
        if (
          !pageTemplates.find(template => template.id === currentPage.template)
        ) {
          continue
        }

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
  }, [manager, currentPage])

  return (
    <Pages
      pageId={currentPage.id}
      form={{
        disableSlug: !currentPage.template,
        values: {
          title: currentPage.jaenPageMetadata?.title || 'No title',
          image: {
            useImage: !!currentPage.jaenPageMetadata?.image,
            src: currentPage.jaenPageMetadata?.image || ''
          },
          slug: currentPage.slug,
          template: currentPage.template,
          description:
            currentPage.jaenPageMetadata.description || 'No description',
          parent: currentPage.parent?.id,
          isExcludedFromIndex: currentPage.excludedFromIndex
        },
        parentPages,
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
        },
        path: manager.pagePath(currentPage.id)
      }}
      children={children}
      tree={manager.tree}
      onTreeSelect={handleTreeSelect}
      disableNewButton={manager.templatesForPage(currentPage.id).length === 0}
    />
  )
}

const Page: React.FC<PageProps> = () => {
  return (
    <CMSManagement>
      <PagesPage />
    </CMSManagement>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Pages',
  icon: 'FaSitemap',

  menu: {
    type: 'app',
    group: 'cms',
    order: 200
  },
  breadcrumbs: [
    {
      label: 'CMS',
      path: '/cms/'
    },
    {
      label: 'Pages',
      path: '/cms/pages/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen'
  }
}
