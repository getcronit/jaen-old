import {
  EditorConfig,
  OutputBlockData,
  OutputData,
  ToolConstructable,
  ToolSettings
} from '@editorjs/editorjs'
import React, {useMemo} from 'react'
import {createPortal} from 'react-dom'
import {EnhancedBlockTool} from './enhance-block-tool.js'

const Content: React.FC<{
  block: OutputBlockData
  tools: EditorConfig['tools']
  readOnly?: boolean
  updateBlock?: (id: string, newData: OutputBlockData['data']) => void
}> = ({block, tools, readOnly, updateBlock}) => {
  const element = useMemo(() => {
    const BlockToolConstructableOrSettings = tools?.[block.type] as
      | ToolConstructable
      | ToolSettings<any>
      | EnhancedBlockTool
      | undefined

    if (!BlockToolConstructableOrSettings) return null

    let BlockTool: ToolConstructable | EnhancedBlockTool | undefined

    if (typeof BlockToolConstructableOrSettings === 'function') {
      BlockTool = BlockToolConstructableOrSettings
    } else {
      BlockTool = BlockToolConstructableOrSettings.class
    }

    if (!BlockTool) return null

    // Check if BlockTool is an EnhancedBlockTool (EnhancedBlockTool has a static called jsxRender)
    if ((BlockTool as any).jsxRender) {
      return (BlockTool as EnhancedBlockTool).jsxRender(block.data, {
        readOnly,
        updateBlock: newData => {
          if (
            updateBlock &&
            block.id &&
            JSON.stringify(block.data) !== JSON.stringify(newData)
          ) {
            updateBlock(block.id, newData)
          }
        }
      })
    }

    // Use normal render function
    return null
  }, [JSON.stringify(block.data), readOnly])

  if (readOnly) {
    return element
  }

  return <Portal rootId={block.id!}>{element}</Portal>
}

const Portal: React.FC<{
  children: React.ReactNode
  rootId: string
}> = ({children, rootId}) => {
  const container = React.useMemo(() => {
    const el = document.createElement('div')
    el.id = rootId
    return el
  }, [rootId, children])

  React.useEffect(() => {
    const oldRoot = document.getElementById(rootId)

    // replace old root with new root
    if (oldRoot) {
      oldRoot.replaceWith(container)
    }
  }, [container])

  return createPortal(children, container)
}

export const Gateway: React.FC<{
  blocks?: OutputData['blocks']
  tools: EditorConfig['tools']
  readOnly?: boolean
  updateBlock?: (id: string, newData: OutputBlockData['data']) => void
}> = props => {
  // const blocksDep = props.blocks?.map(block => block.id).join('')

  // const cleanContainer = useCallback(() => {
  //   props.blocks?.forEach(block => {
  //     const id = block.id

  //     if (!id) return

  //     const container = document.getElementById(id)

  //     if (!container) return

  //     console.log('cleaning container', container)

  //     // check if container is a portal
  //     if (container.getAttribute('data-portal') !== 'true') {
  //       console.log('not a portal')

  //       // Remove all children from container
  //       while (container.firstChild) {
  //         container.removeChild(container.firstChild)
  //       }
  //     }
  //   })
  // }, [blocksDep])

  // useEffect(() => {
  //   cleanContainer()
  // }, [blocksDep])

  // useEffect(() => {
  //   const portals: React.ReactNode[] = []

  //   props.blocks?.forEach(block => {
  //     const id = block.id

  //     if (!id) return

  //     const container = document.getElementById(id)

  //     if (!container) return

  //     container.replaceChildren()

  //     // set attribute to container to mark it as a portal
  //     container.setAttribute('data-portal', 'true')

  //     const portal = createPortal(
  //       <Content block={block} tools={props.tools} />,
  //       container
  //     )

  //     portals.push(portal)
  //   })

  //   setPortals(portals)

  //   return () => {}
  // }, [props.blocks])

  return (
    <div>
      {props.blocks?.map((block, index) => (
        <Content
          key={index}
          block={block}
          tools={props.tools}
          readOnly={props.readOnly}
          updateBlock={props.updateBlock}
        />
      ))}

      <pre>{JSON.stringify(props.blocks, null, 2)}</pre>
    </div>
  )
}
