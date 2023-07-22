// @ts-nocheck

import {Box, useColorModeValue} from '@chakra-ui/react'
import {useEffect, useRef, useState} from 'react'
import {darkTheme, GraphCanvas, lightTheme, useSelection} from 'reagraph'

const data = {
  nodes: [
    {
      id: 'n-1',
      label: 'Home'
    },
    {
      id: 'n-3',
      label: 'Grosshandel'
    },
    {
      id: 'n-4',
      label: 'Wissen'
    },
    {
      id: 'n-5',
      label: 'FAQ'
    },
    {
      id: 'n-6',
      label: '404'
    },
    {
      id: 'n-7',
      label: 'Impressum'
    },
    {
      id: 'n-8',
      label: 'Datenschutz'
    },
    {
      id: 'n-9',
      label: 'AGB'
    },
    {
      id: 'n-10',
      label: 'Content'
    },

    {
      id: 'n-10-1',
      label: 'Web Development'
    },
    {
      id: 'n-10-2',
      label: 'Mobile Development'
    },
    {
      id: 'n-10-3',
      label: 'Design'
    },
    {
      id: 'n-10-4',
      label: 'Marketing'
    },
    {
      id: 'n-11',
      label: 'Related Products'
    }
  ],
  edges: [
    {
      id: '1->2',
      source: 'n-1',
      target: 'n-2',
      label: 'John Doe Last modified 7/1/2023 at 02:00 PM'
    },
    {
      id: '1->10',
      source: 'n-1',
      target: 'n-10',
      label: 'Jane Smith Last modified 7/5/2023 at 11:30 AM'
    },
    {
      id: '1->3',
      source: 'n-1',
      target: 'n-3',
      label: 'Published 7/10/2023 at 05:45 PM'
    },
    {
      id: '1->4',
      source: 'n-1',
      target: 'n-4',
      label: 'Last modified 7/15/2023 at 12:20 PM'
    },
    {
      id: '1->5',
      source: 'n-1',
      target: 'n-5',
      label: 'Last modified 7/15/2023 at 12:20 PM'
    },
    {
      id: '1->6',
      source: 'n-1',
      target: 'n-6',
      label: 'Last modified 7/15/2023 at 12:20 PM'
    },
    {
      id: '1->7',
      source: 'n-1',
      target: 'n-7',
      label: 'Last modified 7/15/2023 at 12:20 PM'
    },
    {
      id: '1->8',
      source: 'n-1',
      target: 'n-8',
      label: 'Published 7/15/2023 at 12:20 PM'
    },
    {
      id: '1->9',
      source: 'n-1',
      target: 'n-9',
      label: 'Published 7/15/2023 at 12:20 PM'
    },

    {
      id: '10->10-1',
      source: 'n-10',
      target: 'n-10-1',
      label: 'Published 7/15/2023 at 12:20 PM'
    },
    {
      id: '10->10-2',
      source: 'n-10',
      target: 'n-10-2',
      label: 'Published 7/15/2023 at 12:20 PM'
    },
    {
      id: '10->10-3',
      source: 'n-10',
      target: 'n-10-3',
      label: 'Published 7/15/2023 at 12:20 PM'
    },
    {
      id: '10->10-4',
      source: 'n-10',
      target: 'n-10-4',
      label: 'Published 7/15/2023 at 12:20 PM'
    },

    {
      id: '3->11',
      source: 'n-3',
      target: 'n-11',
      label: 'Related Products Last modified 7/12/2023 at 09:00 AM'
    }
  ]
}

export const PageVisualizer = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Box
      h="md"
      p="4"
      w="full"
      border="solid 1px"
      borderColor="border.emphasized"
      borderRadius="lg">
      <Box boxSize="full" pos="relative">
        {isMounted ? <Graph /> : null}
      </Box>
    </Box>
  )
}

const Graph = () => {
  const graphRef = useRef(null)
  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut
  } = useSelection({
    ref: graphRef,
    nodes: data.nodes,
    edges: data.edges,
    pathHoverType: 'out',
    pathSelectionType: 'out',
    onSelection: selections => {
      alert(JSON.stringify(selections, null, 2))
    }
  })

  const theme = useColorModeValue(lightTheme, darkTheme)

  return (
    <GraphCanvas
      key={theme}
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
