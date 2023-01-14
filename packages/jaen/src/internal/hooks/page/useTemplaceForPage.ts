import {useEffect, useState} from 'react'
import {IJaenPage, IJaenTemplate} from '../../../types.js'
import {pageLoader} from '../../helper/componentLoader.js'
import {useJaenTemplates} from '../site/useJaenTemplates.js'

const loadTemplatesForPage = async ({
  page,
  templates
}: {
  page: IJaenPage | null
  templates: IJaenTemplate[]
}): Promise<Array<{name: string; displayName: string}>> => {
  if (page == null) {
    return templates
  } else if (page.template) {
    return (
      templates.find(template => template.name === page.template)?.children ||
      []
    )
  } else if (page.componentName) {
    const loadedPage = await pageLoader(page.componentName)

    return (
      loadedPage?.options?.children?.map(child => {
        const t = templates.find(template => template.name === child)

        if (t == null) {
          throw new Error(`Could not find template ${child}`)
        }

        return {
          name: child,
          displayName: t.displayName
        }
      }) || []
    )
  }

  return []
}

/**
 * Loads the possible templates for the page.
 *
 * page.template set: use templates->template.children
 * page.componentName set: load page -> templates from loadedPage.options.children
 *  - if no templates found, use all templates
 *
 * @param page
 * @returns
 */
export const useTemplatesForPage = (page: IJaenPage | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [templates, setTemplates] = useState<
    Array<{
      name: string
      displayName: string
    }>
  >([])

  const jaenTemplates = useJaenTemplates()

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const templates = await loadTemplatesForPage({
        page,
        templates: jaenTemplates.templates
      })
      setTemplates(templates)
      setIsLoading(false)
    }

    if (!jaenTemplates.isLoading) {
      void load()
    }
  }, [page, jaenTemplates.templates])

  return {
    isLoading,
    templates,
    allTemplates: jaenTemplates.templates
  }
}
