import {AddIcon, DeleteIcon} from '@chakra-ui/icons'
import {
  Box,
  BoxProps,
  HStack,
  Icon,
  MenuDivider,
  MenuItem,
  MenuList,
  Tag,
  Text
} from '@chakra-ui/react'
import Tree, {TreeProps} from 'rc-tree'

import 'rc-tree/assets/index.css'
import {DataNode} from 'rc-tree/lib/interface.js'
import React from 'react'
import {FaEye} from 'react-icons/fa'
import {HiDocument, HiMinus, HiPlus} from 'react-icons/hi'

import {matchPath} from '../../../helper/path.js'
import {ContextMenu} from '../../molecules/index.js'
import './tree.css'

export interface PageTreeProps extends BoxProps {
  nodes: {
    /**
     * Path:
     *  /
     *  /foo/
     *  /foo/bar/...
     */
    path: string
    title: string
    isLocked?: boolean
  }[]

  defaultSelectedPath?: string

  shouldPerformDrop?: (info: {dragNode: DataNode; node: DataNode}) => boolean

  onSelectPage?: (path: string) => void
  onViewPage?: (path: string) => void
  onAddPage?: (path: string) => void
  onDeletePage?: (path: string) => void
  onMovePage?: (info: {
    dragPath: string
    dropPath: string
    path: string
  }) => void
}

const useTreeState = (
  initTreeData: DataNode[],
  opt?: {
    defaultSelectedPath?: string
    shouldPerformDrop?: PageTreeProps['shouldPerformDrop']
    onSelectPage?: PageTreeProps['onSelectPage']
    onMovePage?: PageTreeProps['onMovePage']
  }
) => {
  const [treeData, setTreeData] = React.useState<DataNode[]>(initTreeData)

  const {shouldPerformDrop, defaultSelectedPath} = opt || {}

  const onExpand = (expandedKeys: string[]) => {
    console.log('onExpand', expandedKeys)
  }

  const onSelect = (selectedKeys: string[], info: any) => {
    console.log('onSelect', selectedKeys, info)

    if (opt?.onSelectPage) {
      const path = selectedKeys[0]

      if (path) {
        opt.onSelectPage(path)
      } else {
        opt.onSelectPage('/')
      }
    }
  }

  const onCheck = (checkedKeys: string[], info: any) => {
    console.log('onCheck', checkedKeys, info)
  }

  const onDrop: TreeProps['onDrop'] = info => {
    if (
      shouldPerformDrop &&
      !shouldPerformDrop({
        dragNode: info.dragNode,
        node: info.node
      })
    ) {
      return
    }

    console.log('drop', info)
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data: any[], key: string | number, callback: any) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr)
          return
        }
        if (item.children) {
          loop(item.children, key, callback)
        }
      })
    }
    const data = [...treeData]

    // Find dragObject
    let dragObj: any
    loop(data, dragKey, (item: any, index: any, arr: any[]) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (dropPosition === 0) {
      // Drop on the content
      loop(data, dropKey, (item: {children: any[]}) => {
        // eslint-disable-next-line no-param-reassign
        item.children = item.children || []
        item.children.unshift(dragObj)
      })
    } else {
      // Drop on the gap (insert before or insert after)
      let ar: any[] = []
      let i: number = 0
      loop(data, dropKey, (_item: any, index: any, arr: any) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }

    setTreeData(data)

    if (opt?.onMovePage) {
      opt.onMovePage({
        dragPath: dragKey.toString(),
        dropPath: dropKey.toString(),
        path: dragObj.path
      })
    }
  }

  const onDragEnter: TreeProps['onDragEnter'] = () => {}

  const onDragStart: TreeProps['onDragStart'] = () => {}

  const defaultCheckedKeys: string[] = []
  const defaultSelectedKeys = defaultSelectedPath ? [defaultSelectedPath] : []

  return {
    onExpand,
    onSelect,
    onCheck,
    defaultCheckedKeys,
    defaultSelectedKeys,
    treeData,
    onDrop,
    onDragEnter,
    onDragStart
  }
}

const nodesToTreeData = (nodes: PageTreeProps['nodes']): DataNode[] => {
  //  function to build tree structure form nodes with path hirearchy
  // /foo/bar/baz -> /foo -> /foo/bar -> /foo/bar/baz

  const treeData: DataNode[] = []

  nodes.forEach(node => {
    const pathParts = node.path.split('/').filter(Boolean)
    const title = node.title

    let currentTreeData = treeData

    pathParts.forEach((pathPart, index) => {
      const isLast = index === pathParts.length - 1

      const curPath = `/${pathParts.slice(0, index + 1).join('/')}/`

      const existingNode = currentTreeData.find(
        treeDataNode => treeDataNode.key === curPath
      )

      if (existingNode) {
        if (isLast) {
          existingNode.title = title
        }

        currentTreeData = existingNode.children || []
      } else {
        const newNode: DataNode = {
          key: curPath,
          title: isLast ? title : pathPart,
          children: []
        }

        currentTreeData.push(newNode)
        currentTreeData = newNode.children || []
      }
    })
  })

  const rootNode = nodes.find(node => node.path === '/') || {
    title: 'root',
    path: '/',
    isLocked: true
  }

  return [
    {
      key: rootNode.path,
      title: rootNode.title,
      children: treeData
    }
  ]
}

export const PageTree: React.FC<PageTreeProps> = ({
  onSelectPage,
  onViewPage,
  onAddPage,
  onDeletePage,
  onMovePage,
  nodes,
  defaultSelectedPath,
  ...boxProps
}) => {
  nodes =
    nodes?.length > 0
      ? nodes
      : [
          {
            path: '/',
            title: 'root',
            isLocked: true
          }
        ]

  const getNodeFromDataNode = (
    dataNode: DataNode
  ): PageTreeProps['nodes'][0] => {
    console.log('dataNode', dataNode, nodes)

    const node = nodes.find(node =>
      matchPath(node.path, dataNode.key.toString())
    )
    if (!node) {
      throw new Error('Node not found')
    }
    return node
  }

  const {
    onExpand,
    onSelect,
    onCheck,
    onDrop,
    defaultCheckedKeys,
    defaultSelectedKeys,
    treeData
  } = useTreeState(nodesToTreeData(nodes), {
    onSelectPage,
    shouldPerformDrop: ({dragNode}) => {
      // check if the dragNode is locked
      if (getNodeFromDataNode(dragNode).isLocked) {
        return false
      }

      return true
    },
    defaultSelectedPath
  })

  const contextRefs = React.useRef<
    Record<string, React.MutableRefObject<HTMLDivElement | null>>
  >({})

  return (
    <Box overflowY="auto" userSelect="none" h="full" {...boxProps}>
      <Tree
        titleRender={node => {
          const childrenLength = node.children?.length || 0

          return (
            <ContextMenu<HTMLDivElement>
              renderMenu={() => (
                <MenuList>
                  <MenuItem
                    icon={<AddIcon />}
                    onClick={() => {
                      console.log('add')

                      onAddPage?.(node.key.toString())
                    }}>
                    Add
                  </MenuItem>
                  <MenuItem
                    icon={<FaEye />}
                    onClick={() => {
                      console.log('view')

                      onViewPage?.(node.key.toString())
                    }}>
                    View
                  </MenuItem>

                  <MenuDivider />
                  <MenuItem
                    isDisabled={getNodeFromDataNode(node).isLocked}
                    icon={<DeleteIcon color={'red'} />}
                    onClick={() => {
                      onViewPage?.(node.key.toString())
                    }}>
                    Delete
                  </MenuItem>
                </MenuList>
              )}>
              {ref => {
                contextRefs.current[node.key] = ref

                return (
                  <HStack ref={ref}>
                    <Text
                      whiteSpace={'break-spaces'}
                      wordBreak="break-word"
                      noOfLines={1}
                      as="span">
                      <>{node.title}</>
                    </Text>

                    {childrenLength > 0 && (
                      <Tag size={'sm'}>{childrenLength}</Tag>
                    )}
                  </HStack>
                )
              }}
            </ContextMenu>
          )
        }}
        showLine
        checkStrictly={true}
        defaultExpandAll
        onExpand={onExpand}
        draggable
        onDragStart={_event => {}}
        onDragEnter={_event => {}}
        onDrop={onDrop}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultCheckedKeys={defaultCheckedKeys}
        onSelect={onSelect}
        onRightClick={info => {
          const {event, node} = info

          event.preventDefault()
          event.stopPropagation()

          const ref = contextRefs.current[node.key]

          // close all

          console.log(contextRefs.current, node)

          if (ref?.current) {
            ref.current.dispatchEvent(
              new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 2,
                buttons: 2,
                clientX: event.clientX,
                clientY: event.clientY
              })
            )

            // close all other context menu

            for (const key in contextRefs.current) {
              if (key !== node.key) {
                contextRefs.current[key]?.current?.dispatchEvent(
                  new MouseEvent('closeContextMenu')
                )
              }
            }
          }
        }}
        onCheck={onCheck}
        treeData={treeData}
        icon={<Icon as={HiDocument} backgroundColor="white" />}
        switcherIcon={nodeProps => {
          if (nodeProps.isLeaf) {
            return null
          }

          return (
            <Icon
              as={nodeProps.expanded ? HiMinus : HiPlus}
              backgroundColor="white"
            />
          )
        }}
      />
    </Box>
  )
}
