import {ChevronDownIcon} from '@chakra-ui/icons'
import {HStack, Link, Menu, MenuButton, MenuList, Text} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {PageTree} from '../PageTree/PageTree.js'

export interface PageNavigatorProps {}

export const PageNavigator: React.FC<PageNavigatorProps> = () => {
  const [title, setTitle] = useState('No title')

  useEffect(() => {
    if (document.title) {
      setTitle(document.title)
    }
  }, [])

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
          </Link>
        </HStack>
      </MenuButton>
      <MenuList bg="white" color="black" h="sm" overflowY={'auto'}>
        <PageTree nodes={[]} />
      </MenuList>
    </Menu>
  )
}
