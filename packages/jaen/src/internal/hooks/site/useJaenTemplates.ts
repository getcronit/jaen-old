import React from 'react'

import {IJaenTemplate} from '../../../types.js'
import {useSiteContext} from '../../context/SiteContext.js'
import {useAdminStaticQuery} from '../useAdminStaticQuery.js'

/**
 * Access the JaenTemplates
 */
export const useJaenTemplates = () => {
  const site = useSiteContext()
  const {
    jaenTemplate: {nodes: jaenTemplates}
  } = useAdminStaticQuery()

  const [isLoading, setIsLoading] = React.useState(true)

  const [templates, setTemplates] =
    React.useState<Record<string, IJaenTemplate> | null>(null)

  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const tmpls: Record<string, IJaenTemplate> = {}

      for (const templateNode of jaenTemplates) {
        const {name: loadTemplate} = templateNode

        if (loadTemplate && !(loadTemplate in (templates || {}))) {
          const Component = await site.templateLoader(loadTemplate)
          const children = []

          for (const child of Component.options.children) {
            const ad = await site.templateLoader(child)
            children.push({
              name: child,
              label: ad.options.label
            })
          }

          tmpls[loadTemplate] = {
            name: loadTemplate,
            label: Component.options.label,
            children,
            isRootTemplate: Component.options.isRootTemplate
          }
        }
      }

      setTemplates(tmpls)
      setIsLoading(false)
    }

    void load()
  }, [])

  const templatesArray = React.useMemo(
    () => Object.values(templates || {}),
    [templates]
  )

  return {templates: templatesArray, isLoading}
}
