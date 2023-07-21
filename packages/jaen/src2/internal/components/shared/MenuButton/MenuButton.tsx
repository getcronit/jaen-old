import {
  As,
  Box,
  Button,
  ButtonProps,
  Icon,
  Menu,
  MenuButton as ChakraMenuButton,
  MenuDivider,
  MenuItem as ChakraMenuItem,
  MenuList
} from '@chakra-ui/react'
import {FaCaretDown} from 'react-icons/fa'

interface MenuItem {
  icon: As
  label: string
  onClick?: () => void
  divider?: boolean
}

export interface MenuButtonProps extends ButtonProps {
  items?: Record<string, MenuItem>
  renderItems?: (items: Record<string, MenuItem>) => React.ReactNode
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  items = {},
  renderItems,
  ...buttonProps
}) => {
  return (
    <Menu>
      <ChakraMenuButton
        as={Button}
        rightIcon={<Icon as={FaCaretDown} />}
        size="sm"
        variant="outline"
        {...buttonProps}
      />
      <MenuList bgColor="body.bgColor" borderColor="body.borderColor">
        {renderItems?.(items)}

        {Object.entries(items).map(([key, value]) => {
          return (
            <Box key={key} mx="2">
              <ChakraMenuItem
                bgColor="body.bgColor"
                borderColor="body.borderColor"
                _hover={{
                  bgColor: 'body.hover.bgColor'
                }}
                _focus={{
                  bgColor: 'body.active.bgColor'
                }}
                borderRadius="lg"
                icon={<Icon as={value.icon} color="icon" />}
                onClick={value.onClick}>
                {value.label}
              </ChakraMenuItem>
              {value.divider && <MenuDivider borderColor="divider" />}
            </Box>
          )
        })}
      </MenuList>
    </Menu>
  )
}
