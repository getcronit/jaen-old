import {Box, Text} from '@chakra-ui/react'
import {
  StaticTreeDataProvider,
  Tree,
  UncontrolledTreeEnvironment
} from 'react-complex-tree'

import 'react-complex-tree/lib/style-modern.css'

import {cmsTree} from './treeData'

export interface PageTreeProps {}

const provider = new StaticTreeDataProvider(cmsTree.items, (item, data) => ({
  ...item,
  data
}))

provider.onDidChangeTreeData(items => {
  console.log(items)
})

export const PageTree: React.FC<PageTreeProps> = () => {
  return (
    <UncontrolledTreeEnvironment
      dataProvider={provider}
      getItemTitle={item => item.data}
      viewState={{}}
      renderTreeContainer={props => (
        <Box
          w="full"
          className="tree"
          sx={{
            '--rct-bar-color': 'var(--chakra-colors-brand-500)',
            '--rct-color-drag-between-line-bg':
              'var(--chakra-colors-brand-500)',
            '--rct-item-height': '2.5rem'
          }}>
          <ul className="tree-root tree-node-list" {...props.containerProps}>
            {props.children}
          </ul>
        </Box>
      )}
      renderItemTitle={props => {
        return <Text fontSize="sm">{props.title}</Text>
      }}
      canDropAt={(items, target) => {
        console.log(items, target)

        return true
      }}
      canDragAndDrop
      canDropOnFolder
      canReorderItems={false}>
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  )
}
