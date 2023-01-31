import {HamburgerIcon} from '@chakra-ui/icons'
import {Flex, HStack, IconButton, Spacer} from '@chakra-ui/react'
import {LocationBreadcrumbs} from './LocationBreadcrumbs.js'
import {ToolbarActionContext} from './ToolbarActionContext'

export interface AdminSecondaryToolbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export const AdminSecondaryToolbar: React.FC<AdminSecondaryToolbarProps> = ({
  isSidebarOpen,
  onToggleSidebar
}) => {
  return (
    <Flex
      minH="14"
      w="full"
      align="center"
      px={{base: 4}}
      boxShadow="md"
      borderTop="1px"
      borderTopColor="gray.200"
      bg="white">
      <HStack>
        <IconButton
          aria-label="Open sidebar"
          icon={<HamburgerIcon />}
          fontSize="xl"
          variant="ghost"
          colorScheme="gray"
          onClick={onToggleSidebar}
          isActive={isSidebarOpen}
        />

        <LocationBreadcrumbs />
      </HStack>
      <Spacer />
      <ToolbarActionContext.Consumer>
        {actions => (
          <HStack spacing="4">
            {actions.actions.map(action => (
              <>{action}</>
            ))}
          </HStack>
        )}
      </ToolbarActionContext.Consumer>
    </Flex>
  )
}
