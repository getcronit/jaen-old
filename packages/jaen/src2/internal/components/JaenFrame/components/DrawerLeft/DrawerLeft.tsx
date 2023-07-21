import {HamburgerIcon} from '@chakra-ui/icons'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import {useRef} from 'react'
import {JaenFullLogo} from '../../../shared/JaenLogo/JaenLogo.js'
import {
  NavigationGroups,
  NavigationGroupsProps
} from '../NavigationGroups/index.js'

export interface DrawerLeftProps {
  navigationGroups: NavigationGroupsProps['groups']
  logo?: JSX.Element
  version: string
}

export const DrawerLeft: React.FC<DrawerLeftProps> = ({
  navigationGroups,
  logo,
  version
}) => {
  const {isOpen, onClose, onToggle} = useDisclosure()

  const initialFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <IconButton
        aria-label="Open main menu"
        icon={<HamburgerIcon fontSize="lg" color="icon" />}
        size="sm"
        onClick={onToggle}
        variant="outline"
      />
      <Drawer
        placement="left"
        size="xs"
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialFocusRef}>
        <DrawerOverlay bg="rgba(0,0,0,0.1)" />

        <DrawerContent borderRightRadius="xl" bgColor="body.bgColor">
          <DrawerHeader p="4">
            <HStack justifyContent="space-between">
              <Box cursor="pointer">
                {logo || <JaenFullLogo h="8" w="auto" cursor="pointer" />}
              </Box>
              <DrawerCloseButton
                ref={initialFocusRef}
                pos="static"
                onClick={onClose}
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody p="4" display="flex" flexDirection="column">
            <NavigationGroups groups={navigationGroups} />
          </DrawerBody>
          <DrawerFooter justifyContent="space-between">
            <JaenFullLogo h="8" w="auto" cursor="pointer" />

            <Text fontSize="xs" color="muted">
              {version}
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
