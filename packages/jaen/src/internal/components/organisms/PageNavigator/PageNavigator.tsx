import {ChevronDownIcon, ChevronUpIcon} from '@chakra-ui/icons'
import {Button, Menu, MenuButton, MenuList, Text} from '@chakra-ui/react'
import {useEffect, useMemo, useState} from 'react'
import {FaSitemap} from 'react-icons/fa'
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
      {({isOpen}) => (
        <>
          <MenuButton
            as={Button}
            leftIcon={<FaSitemap />}
            rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            fontWeight="normal"
            size="sm"
            w={{
              base: '24',
              md: '44'
            }}
            rounded="lg"
            bg="gray.50"
            color="gray.500"
            _hover={{bg: 'pink.50'}}
            py={{base: 1}}
            px={{base: 2}}
            _active={{bg: 'pink.100'}}>
            <Text isTruncated>{title}</Text>
          </MenuButton>
          <MenuList bg="white" color="black" h="xs" overflowY="auto">
            <PageTree
              nodes={manager.pagePaths}
              isNavigatorMode
              selectedPath={path || '/'}
              onViewPage={manager.onNavigate}
            />
          </MenuList>
        </>
      )}
    </Menu>
  )
}
