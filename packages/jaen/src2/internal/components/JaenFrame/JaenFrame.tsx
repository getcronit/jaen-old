import {AddIcon} from '@chakra-ui/icons'
import {Box, Flex, HStack} from '@chakra-ui/react'
import React, {useMemo, useState} from 'react'

import {JaenLogo} from '../shared/JaenLogo/JaenLogo.js'
import {MenuButton, MenuButtonProps} from '../shared/MenuButton/MenuButton.js'
import {
  Breadcrumbs,
  BreadcrumbsProps
} from './components/Breadcrumbs/Breadcrumbs.js'
import {
  DrawerLeft,
  DrawerLeftProps
} from './components/DrawerLeft/DrawerLeft.js'
import {
  DrawerRight,
  DrawerRightProps
} from './components/DrawerRight/DrawerRight.js'
import {Toolbar, ToolbarContext} from './contexts/toolbar.js'

export interface JaenFrameProps {
  logo?: JSX.Element
  navigation: {
    app: {
      navigationGroups: DrawerLeftProps['navigationGroups']
      version: DrawerLeftProps['version']
      logo: DrawerLeftProps['logo']
    }
    user: {
      navigationGroups: DrawerRightProps['navigationGroups']
    }
    addMenu: {
      items: MenuButtonProps['items']
    }
    breadcrumbs: {
      links: BreadcrumbsProps['links']
    }
  }

  children: React.ReactNode
}

export const JaenFrame: React.FC<JaenFrameProps> = props => {
  const [toolbar, setToolbar] = useState<Toolbar | null>(null)

  const children = useMemo(
    () => (
      <ToolbarContext.Provider value={{setToolbar}}>
        {props.children}
      </ToolbarContext.Provider>
    ),
    [props.children]
  )

  return (
    <Flex pos="relative" flexDirection="column">
      <HStack
        as="header"
        pos="sticky"
        zIndex="sticky"
        top="0"
        h="16"
        p="16px"
        bgColor="subtleBody.bgColor"
        borderBottom="1px"
        borderColor="subtleBody.borderColor"
        backdropBlur={8}
        justifyContent="space-between">
        <HStack spacing="5" h="full">
          <DrawerLeft
            navigationGroups={props.navigation.app.navigationGroups}
            version={props.navigation.app.version}
            logo={props.navigation.app.logo}
          />
          <Box cursor="pointer">
            {props.logo || (
              <JaenLogo h="full" w="auto" transform="scale(1.05)" />
            )}
          </Box>
          <Breadcrumbs links={props.navigation.breadcrumbs.links} />

          <>
            {toolbar?.components?.map(
              (Component, index) => Component && <Component key={index} />
            )}
          </>
        </HStack>

        <HStack spacing="5">
          <MenuButton variant="outline" items={props.navigation.addMenu.items}>
            <AddIcon color="icon" />
          </MenuButton>

          <DrawerRight
            navigationGroups={props.navigation.user.navigationGroups}
          />
        </HStack>
      </HStack>

      {children}
    </Flex>
  )
}
