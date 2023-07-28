import {useColorModeValue} from '@chakra-ui/react'
import {useEffect, useRef} from 'react'

import {darkTheme, GraphCanvas, lightTheme, useSelection} from 'reagraph'
import {convertTreeToGraph, TreeNode} from './convert-tree-to-graph'

export const Graph: React.FC<{
  tree: TreeNode[]
  selection?: string
  onSelect: (id: string) => void
}> = ({tree, selection, onSelect}) => {
  const data = convertTreeToGraph(tree)

  const graphRef = useRef(null)
  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut,
    setSelections
  } = useSelection({
    ref: graphRef,
    nodes: data.nodes,
    edges: data.edges,
    pathHoverType: 'out',
    pathSelectionType: 'out',
    onSelection: selections => {
      const selection = selections[0]

      if (selection) {
        onSelect(selection)
      } else {
        onSelect('')
        // setSelections(selection ? [selection] : [])
      }
    }
    // selections: selection ? [selection] : []
  })

  useEffect(() => {
    setSelections(selection ? [selection] : [])
  }, [selection])

  const theme = useColorModeValue(lightTheme, darkTheme)

  return (
    <GraphCanvas
      key={theme === lightTheme ? 'light' : 'dark'}
      ref={graphRef}
      theme={theme}
      nodes={data.nodes}
      edges={data.edges}
      selections={selections}
      actives={actives}
      onNodePointerOver={onNodePointerOver}
      onNodePointerOut={onNodePointerOut}
      onCanvasClick={onCanvasClick}
      onNodeClick={onNodeClick}
    />
  )
}
