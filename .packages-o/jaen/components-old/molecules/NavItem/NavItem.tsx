import {Button, Circle, Icon} from '@chakra-ui/react'
import * as React from 'react'

interface NavItemProps {
  href?: string
  label: string
  subtle?: boolean
  active?: boolean
  Icon: React.ComponentType | null
  onClick?: () => void
}

export const NavItem = (props: NavItemProps) => {
  const {active, subtle, Icon: IconComponent, label, onClick} = props

  return (
    <Button
      onClick={onClick}
      w="full"
      py="3"
      cursor="pointer"
      userSelect="none"
      rounded="md"
      transition="all 0.2s"
      fontSize="lg"
      bg={active ? 'pink.100' : undefined}
      _hover={{bg: active ? undefined : 'pink.50'}}
      _active={{bg: 'pink.100'}}
      justifyContent="flex-start"
      flex="1"
      variant="ghost"
      leftIcon={<Icon as={IconComponent || Circle} color="pink.400" />}
      fontWeight="inherit"
      color={subtle ? 'gray.400' : 'black'}>
      {label}
    </Button>
  )
}
