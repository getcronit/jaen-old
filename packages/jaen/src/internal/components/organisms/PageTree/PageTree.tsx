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
import React, {useEffect, useMemo} from 'react'
import {FaEye} from 'react-icons/fa'
import {HiDocument, HiMinus, HiPlus} from 'react-icons/hi'

import {matchPath} from '../../../helper/path.js'
import {ContextMenuEvent} from '../../molecules/ContextMenu/ContextMenu.js'
import {ContextMenu} from '../../molecules/ContextMenu/index.js'

import './tree.css'

export interface PageTreeProps extends BoxProps {
  isNavigatorMode?: boolean

  nodes: Array<{
    /**
     * Path:
     *  /
     *  /foo/
     *  /foo/bar/...
     */
    path: string
    title: string
    isLocked?: boolean
  }>

  defaultSelectedPath?: string
  selectedPath?: string

  shouldPerformDrop?: (info: {
    dragNode: DataNode
    node: DataNode
    dropPosition: number
  }) => boolean

  onSelectPage?: (path: string) => void
  onViewPage?: (path: string) => void
  onAddPage?: (path: string) => void
  onDeletePage?: (path: string) => void
  onMovePage?: (info: {
    dragParentPath: string
    dropPath: string
    dragPath: string
  }) => void
}

const useTreeState = (
  initTreeData: DataNode[],
  opt?: {
    isNavigatorMode?: boolean
    defaultSelectedPath?: string
    selectedPath?: string
    shouldPerformDrop?: PageTreeProps['shouldPerformDrop']
    onSelectPage?: PageTreeProps['onSelectPage']
    onMovePage?: PageTreeProps['onMovePage']
    onViewPage?: PageTreeProps['onViewPage']
  }
) => {
  const [treeData, setTreeData] = React.useState<DataNode[]>(initTreeData)

  useEffect(() => {
    setTreeData(initTreeData)
  }, [initTreeData])

  const {
    shouldPerformDrop,
    onViewPage,
    onSelectPage,
    defaultSelectedPath,
    selectedPath,
    isNavigatorMode
  } = opt || {}

  const onExpand = (expandedKeys: string[]) => {
    console.log('onExpand', expandedKeys)
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys, info)

    const path = selectedKeys[0]?.toString() || '/'

    if (isNavigatorMode) {
      onViewPage?.(path)
    } else {
      // check if the it is a deselection

      if (selectedKeys.length === 0) {
        // view info.node.key
        onViewPage?.(info.node.key.toString())
      } else {
        onSelectPage?.(path)
      }
    }
  }

  const onCheck = (checkedKeys: string[], info: any) => {
    console.log('onCheck', checkedKeys, info)
  }

  const onDrop: TreeProps['onDrop'] = info => {
    if (isNavigatorMode) {
      return
    }

    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    if (
      shouldPerformDrop &&
      !shouldPerformDrop({
        dragNode: info.dragNode,
        node: info.node,
        dropPosition
      })
    ) {
      return
    }

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
        dragParentPath: getParentNodePath(dragKey.toString())
      })
    }
  }

  const onDragEnter: TreeProps['onDragEnter'] = () => {}

  const onDragStart: TreeProps['onDragStart'] = () => {}

  const defaultCheckedKeys: string[] = []
  const defaultSelectedKeys = defaultSelectedPath ? [defaultSelectedPath] : []

  const selectedKeys: string[] | undefined = selectedPath
    ? [selectedPath]
    : undefined

  const getParentNodePath = (path: string) => {
    // remove the last slash
    path = path.replace(/\/$/, '')

    const parts = path.split('/')

    if (parts.length === 1) {
      return '/'
    }

    parts.pop()

    return parts.join('/') + '/'
  }

  return {
    onExpand,
    onSelect,
    onCheck,
    defaultCheckedKeys,
    defaultSelectedKeys,
    selectedKeys,
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
  isNavigatorMode,
  onSelectPage,
  onViewPage,
  onAddPage,
  onDeletePage,
  onMovePage,
  nodes,
  defaultSelectedPath,
  selectedPath,
  ...boxProps
}) => {
  const getNodeFromDataNode = (
    dataNode: DataNode
  ): PageTreeProps['nodes'][0] => {
    const node = nodes.find(node =>
      matchPath(node.path, dataNode.key.toString())
    )
    if (node == null) {
      throw new Error('Node not found')
    }
    return node
  }

  const initTreeData = useMemo(
    () =>
      nodesToTreeData(
        nodes?.length > 0
          ? nodes
          : [
              {
                path: '/',
                title: 'root',
                isLocked: true
              }
            ]
      ),
    [nodes]
  )

  const {
    onExpand,
    onSelect,
    onCheck,
    onDrop,
    defaultCheckedKeys,
    defaultSelectedKeys,
    selectedKeys,
    treeData
  } = useTreeState(initTreeData, {
    isNavigatorMode,
    onViewPage,
    onSelectPage,
    onMovePage,
    shouldPerformDrop: ({dragNode, dropPosition}) => {
      // check if the dragNode is locked
      if (getNodeFromDataNode(dragNode).isLocked) {
        return false
      }

      if (dropPosition === -1) {
        return false
      }

      return true
    },
    defaultSelectedPath,
    selectedPath
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
                <>
                  {!isNavigatorMode && (
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
                        icon={<DeleteIcon color="red" />}
                        onClick={() => {
                          onViewPage?.(node.key.toString())
                        }}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  )}
                </>
              )}>
              {ref => {
                contextRefs.current[node.key] = ref

                return (
                  <HStack ref={ref} w="full" h="full" py="2" px="2">
                    <Icon as={HiDocument} backgroundColor="white" />

                    <Text
                      whiteSpace="break-spaces"
                      wordBreak="break-word"
                      noOfLines={1}
                      as="span"
                      w="full"
                      h="full">
                      <>{node.title}</>
                    </Text>

                    {childrenLength > 0 && (
                      <Tag size="sm">{childrenLength}</Tag>
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
        autoExpandParent
        defaultSelectedKeys={defaultSelectedKeys}
        defaultCheckedKeys={defaultCheckedKeys}
        selectedKeys={selectedKeys}
        onSelect={(keys, info) => {
          const {nativeEvent} = info

          const ref = contextRefs.current[info.node.key]

          // if the click was on the context menu, don't select the node
          // @ts-expect-error
          if (!(ref?.current && ref?.current?.contains(nativeEvent.target))) {
            alert('select')
            return
          }

          onSelect(keys, info)
        }}
        onRightClick={info => {
          const {event, node} = info

          event.preventDefault()
          event.stopPropagation()

          const ref = contextRefs.current[node.key]

          if (ref?.current) {
            ref.current.dispatchEvent(
              new MouseEvent(ContextMenuEvent.Open, {
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
                  new MouseEvent(ContextMenuEvent.Close)
                )
              }
            }
          }
        }}
        onCheck={onCheck}
        icon={<></>}
        treeData={treeData}
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
