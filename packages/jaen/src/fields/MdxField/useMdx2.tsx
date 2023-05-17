import {evaluate, evaluateSync} from '@mdx-js/mdx'
import {useDebounceFn} from 'ahooks'
import {useState} from 'react'
import * as runtime from 'react/jsx-runtime'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {VFile} from 'vfile'
import {VFileMessage} from 'vfile-message'

export function useMdx(defaults: {
  gfm: boolean
  frontmatter: boolean
  math: boolean
  directive: boolean
  value: any
}) {
  const [state, setState] = useState(() => {
    const file = new VFile({basename: 'example.mdx', value: defaults.value})

    const remarkPlugins = []

    if (defaults.gfm) remarkPlugins.push(remarkGfm)
    if (defaults.frontmatter) remarkPlugins.push(remarkFrontmatter)
    if (defaults.math) remarkPlugins.push(remarkMath)
    if (defaults.directive) remarkPlugins.push(remarkDirective)

    const capture = (name: string) => () => (tree: unknown) => {
      file.data[name] = tree
    }

    remarkPlugins.push(capture('mdast'))

    try {
      file.result = evaluateSync(file, {
        ...runtime,
        useDynamicImport: true,
        remarkPlugins,
        rehypePlugins: [],
        recmaPlugins: []
      } as any).default
    } catch (error) {
      const message =
        error instanceof VFileMessage ? error : new VFileMessage(error)

      if (!file.messages.includes(message)) {
        file.messages.push(message)
      }

      message.fatal = true
    }

    return {
      ...defaults,
      file,
      mdast: undefined,
      hast: undefined,
      stats: undefined
    }
  })
  const {run: setConfig} = useDebounceFn(
    async config => {
      const file = new VFile({basename: 'example.mdx', value: config.value})

      const capture = (name: string) => () => (tree: unknown) => {
        file.data[name] = tree
      }

      const remarkPlugins = []

      if (config.gfm) remarkPlugins.push(remarkGfm)
      if (config.frontmatter) remarkPlugins.push(remarkFrontmatter)
      if (config.math) remarkPlugins.push(remarkMath)
      if (config.directive) remarkPlugins.push(remarkDirective)

      remarkPlugins.push(capture('mdast'))

      try {
        file.result = (
          await evaluate(file, {
            ...runtime,
            useDynamicImport: true,
            remarkPlugins,
            rehypePlugins: [],
            recmaPlugins: []
          } as any)
        ).default
      } catch (error) {
        const message =
          error instanceof VFileMessage ? error : new VFileMessage(error)

        if (!file.messages.includes(message)) {
          file.messages.push(message)
        }

        message.fatal = true
      }

      setState({...config, file})
    },
    {leading: true, trailing: true, wait: 200}
  )

  return [state, setConfig]
}
