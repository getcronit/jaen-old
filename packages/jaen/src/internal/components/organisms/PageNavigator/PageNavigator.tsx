import {ChevronDownIcon} from '@chakra-ui/icons'
import {
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Tag,
  Text
} from '@chakra-ui/react'
import {useEffect, useMemo, useState} from 'react'
import {usePageManager} from '../../../context/AdminPageManager/AdminPageManager.js'
import {PageTree} from '../PageTree/PageTree.js'

export interface PageNavigatorProps {}

export const PageNavigator: React.FC<PageNavigatorProps> = () => {
  const [title, setTitle] = useState('No title')

  useEffect(() => {
    if (document.title) {
      setTitle(document.title)
    }
  }, [])

  const path = useMemo(() => {
    if (typeof window === 'undefined') return null

    let pathname = window.location.pathname

    const hash = window.location.hash

    // return path after hash if hash is present
    if (hash) {
      pathname = hash.replace('#', '')
    }

    return pathname
  }, [])

  const manager = usePageManager()

  return (
    <Menu>
      <MenuButton
        h="full"
        bg="gray.50"
        color="gray.500"
        _hover={{bg: 'pink.50'}}
        rounded={'full'}
        py={{base: 1}}
        px={{base: 2}}
        _active={{bg: 'pink.100'}}>
        <HStack>
          <Text
            display={{
              base: 'none',
              xl: 'block'
            }}>
            Current page:
          </Text>
          <Link noOfLines={1}>
            {title} <ChevronDownIcon />
            <Tag rounded="full">{path}</Tag>
          </Link>
        </HStack>
      </MenuButton>
      <MenuList bg="white" color="black" h="xs" overflowY={'auto'}>
        <PageTree
          nodes={manager.pagePaths}
          isNavigatorMode
          selectedPath={path || '/'}
          onViewPage={manager.onNavigate}
        />
      </MenuList>
    </Menu>
  )
}
