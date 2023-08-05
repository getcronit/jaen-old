import {Box, Text} from '@chakra-ui/react'
import {
  StaticTreeDataProvider,
  Tree,
  UncontrolledTreeEnvironment
} from 'react-complex-tree'

import 'react-complex-tree/lib/style-modern.css'
import {convertTreeToPageTree, TreeNode} from './convert-tree-to-page-tree'
import {cmsTree} from './treeData'

export interface PageTreeProps {
  tree: TreeNode[]
  onSelected: (id: string) => void
}

export const PageTree: React.FC<PageTreeProps> = ({tree}) => {
  const pageTree = convertTreeToPageTree(tree)

  console.log('items', cmsTree.items, pageTree)

  const provider = new StaticTreeDataProvider(pageTree.items, (item, data) => ({
    ...item,
    data
  }))

  return (
    <UncontrolledTreeEnvironment
      dataProvider={provider}
      getItemTitle={item => item.data}
      viewState={{
        'tree-1': {
          expandedItems: ['root', 'JaenPage /']
        }
      }}
      renderTreeContainer={props => (
        <Box
          w="full"
          className="tree"
          sx={{
            '--rct-bar-color': 'var(--chakra-colors-brand-500)',
            '--rct-color-drag-between-line-bg':
              'var(--chakra-colors-brand-500)',
            '--rct-item-height': '2rem'
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
      onSelectItems={items => {
        console.log(items)
      }}
      canDragAndDrop
      canDropOnFolder
      canReorderItems={false}>
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  )
}
