import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
  Text,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react'
import {useRef} from 'react'
import {FaMoon, FaSun} from 'react-icons/fa'
import {
  NavigationGroups,
  NavigationGroupsProps
} from '../NavigationGroups/index.js'

export interface DrawerRightProps {
  navigationGroups: NavigationGroupsProps['groups']
}

export const DrawerRight: React.FC<DrawerRightProps> = ({navigationGroups}) => {
  const {isOpen, onClose, onToggle} = useDisclosure()

  const initialFocusRef = useRef<HTMLButtonElement>(null)

  const colorMode = useColorMode()

  return (
    <>
      <Avatar
        as="button"
        aria-label="Open user menu"
        p="0"
        m="0"
        size="sm"
        cursor="pointer"
        src="https://avatars.githubusercontent.com/u/52858351?v=4"
        onClick={onToggle}
      />
      <Drawer
        placement="right"
        size="xs"
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialFocusRef}>
        <DrawerOverlay bg="rgba(0,0,0,0.1)" />

        <DrawerContent borderLeftRadius="xl" bgColor="body.bgColor">
          <DrawerHeader p="4">
            <HStack justifyContent="space-between">
              <Stack>
                <HStack>
                  <Avatar
                    size="sm"
                    src="https://avatars.githubusercontent.com/u/52858351?v=4"
                  />
                  <Stack spacing="0.5">
                    <Text fontSize="sm" fontWeight="bold" lineHeight="none">
                      schettn
                    </Text>
                    <Text fontSize="sm" color="muted" lineHeight="none">
                      Nico Schett
                    </Text>
                  </Stack>
                </HStack>
              </Stack>

              <DrawerCloseButton
                ref={initialFocusRef}
                pos="static"
                onClick={onClose}
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody p="4" display="flex" flexDirection="column">
            <NavigationGroups groups={navigationGroups} />
            <Spacer />
            <HStack justifyContent="space-between"></HStack>
          </DrawerBody>

          <DrawerFooter>
            <IconButton
              size="sm"
              variant="outline"
              icon={
                <Icon
                  as={colorMode.colorMode === 'light' ? FaSun : FaMoon}
                  color="icon"
                />
              }
              onClick={colorMode.toggleColorMode}
              aria-label="Toggle color mode"
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
