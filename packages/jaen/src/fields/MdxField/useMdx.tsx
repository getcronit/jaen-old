import {evaluateSync} from '@mdx-js/mdx'
import {useDebounceFn} from 'ahooks'
import {mdxToMarkdown} from 'mdast-util-mdx'
import {useEffect, useState} from 'react'
import * as runtime from 'react/jsx-runtime'
import rehypeSlug from 'rehype-slug-custom-id'

import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkUnwrapImages from 'remark-unwrap-images'
import {VFile} from 'vfile'
import {VFileMessage} from 'vfile-message'

import {toMarkdown} from 'mdast-util-to-markdown'
import {MdastRoot} from './components/types.js'

const parseMdast = (tree: MdastRoot) => {
  const out = toMarkdown(tree, {extensions: [mdxToMarkdown()]})

  return out
}

function createFile(value: string) {
  return new VFile({basename: 'example.mdx', value})
}

function evaluateFile(file: VFile) {
  const capture = (name: string) => () => (tree: any) => {
    file.data[name] = tree
  }

  try {
    file.result = evaluateSync(file, {
      ...(runtime as any),
      useDynamicImport: true,
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        remarkMath,
        remarkDirective,
        remarkUnwrapImages,
        capture('mdast')
      ],
      rehypePlugins: [rehypeSlug],
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
interface Defaults {
  gfm: boolean
  frontmatter: boolean
  math: boolean
  directive: boolean
  mdast?: MdastRoot
}
const initializeState = (defaults: Defaults) => {
  const markdown = defaults.mdast ? parseMdast(defaults.mdast) : ''

  const file = createFile(markdown)

  evaluateFile(file)

  return {
    ...defaults,
    value: markdown,
    file
  }
}

export function useMdx(defaults: Defaults, live: boolean = false) {
  const [state, setState] = useState(() => initializeState(defaults))

  useEffect(() => {
    if (live) {
      setState(initializeState(defaults))
    }
  }, [defaults, live])

  const {run: setConfig} = useDebounceFn(
    async config => {
      const file = createFile(config.value)

      evaluateFile(file)

      setState({...config, file})
    },
    {leading: true, trailing: true, wait: 200}
  )

  return [state, setConfig]
}
