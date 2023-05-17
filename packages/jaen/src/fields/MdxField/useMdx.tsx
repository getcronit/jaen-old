import {evaluateSync} from '@mdx-js/mdx'
import {useDebounceFn} from 'ahooks'
import {useState} from 'react'
import * as runtime from 'react/jsx-runtime'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {VFile} from 'vfile'
import {VFileMessage} from 'vfile-message'

function createFile(value: string) {
  return new VFile({basename: 'example.mdx', value})
}

function captureData(name: string, file: VFile) {
  return (tree: any) => {
    file.data[name] = tree
  }
}

function evaluateFile(file: VFile, remarkPlugins: any[]) {
  try {
    file.result = evaluateSync(file, {
      ...(runtime as any),
      useDynamicImport: true,
      remarkPlugins,
      rehypePlugins: [],
      recmaPlugins: []
    }).default
  } catch (error) {
    const message =
      error instanceof VFileMessage ? error : new VFileMessage(error)

    if (!file.messages.includes(message)) {
      file.messages.push(message)
    }

    message.fatal = true
  }
}

export function useMdx(defaults: {
  gfm: boolean
  frontmatter: boolean
  math: boolean
  directive: boolean
  value: any
}) {
  const [state, setState] = useState(() => {
    const file = createFile(defaults.value)
    const remarkPlugins = []

    if (defaults.gfm) remarkPlugins.push(remarkGfm)
    if (defaults.frontmatter) remarkPlugins.push(remarkFrontmatter)
    if (defaults.math) remarkPlugins.push(remarkMath)
    if (defaults.directive) remarkPlugins.push(remarkDirective)

    remarkPlugins.push(captureData('mdast', file))
    evaluateFile(file, remarkPlugins)

    return {
      ...defaults,
      file
    }
  })

  const {run: setConfig} = useDebounceFn(
    async config => {
      const file = createFile(config.value)
      const remarkPlugins = []

      if (config.gfm) remarkPlugins.push(remarkGfm)
      if (config.frontmatter) remarkPlugins.push(remarkFrontmatter)
      if (config.math) remarkPlugins.push(remarkMath)
      if (config.directive) remarkPlugins.push(remarkDirective)

      remarkPlugins.push(captureData('mdast', file))
      evaluateFile(file, remarkPlugins)

      setState({...config, file})
    },
    {leading: true, trailing: true, wait: 200}
  )

  return [state, setConfig]
}
