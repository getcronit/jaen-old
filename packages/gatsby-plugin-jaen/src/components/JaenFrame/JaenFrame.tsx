import {Box, Divider, Flex, HStack, Icon, Spacer} from '@chakra-ui/react'
import React from 'react'
import {FaPlus} from 'react-icons/fa'

import {JaenLogo} from '../shared/JaenLogo/JaenLogo'
import {MenuButton, MenuButtonProps} from '../shared/MenuButton/MenuButton'
import {
  Breadcrumbs,
  BreadcrumbsProps
} from './components/Breadcrumbs/Breadcrumbs'
import {DrawerLeft, DrawerLeftProps} from './components/DrawerLeft/DrawerLeft'
import {
  DrawerRight,
  DrawerRightProps
} from './components/DrawerRight/DrawerRight'
import {JaenFrameToolbarContext} from './contexts/jaen-frame-toolbar'

export interface JaenFrameProps {
  logo?: JSX.Element
  navigation: {
    isStickyDisabled?: boolean
    app: {
      navigationGroups: DrawerLeftProps['navigationGroups']
      version: DrawerLeftProps['version']
      logo: DrawerLeftProps['logo']
    }
    user: {
      user: DrawerRightProps['user']
      navigationGroups: DrawerRightProps['navigationGroups']
    }
    addMenu: {
      items: MenuButtonProps['items']
    }
    breadcrumbs: {
      links: BreadcrumbsProps['links']
    }
  }
}

export const JaenFrame: React.FC<JaenFrameProps> = props => {
  // const [toolbar, setToolbar] = useState<Toolbar | null>(null)

  // const children = useMemo(
  //   () => (
  //     <ToolbarContext.Provider value={{setToolbar}}>
  //       {props.children}
  //     </ToolbarContext.Provider>
  //   ),
  //   [props.children]
  // )

  return (
    <HStack
      id="coco"
      as="header"
      bg="bg.subtle"
      {...(!props.navigation.isStickyDisabled && {
        pos: 'sticky',
        top: '0',
        zIndex: 'sticky'
      })}
      h="16"
      p="16px"
      borderBottom="1px"
      borderColor="border.emphasized"
      backdropBlur={8}
      justifyContent="space-between"
      zIndex="sticky">
      <HStack spacing="5" h="full">
        <DrawerLeft
          navigationGroups={props.navigation.app.navigationGroups}
          version={props.navigation.app.version}
          logo={props.navigation.app.logo}
        />
        <Box cursor="pointer" maxW="12rem">
          {props.logo || <JaenLogo h="full" w="auto" transform="scale(1.05)" />}
        </Box>
        <Breadcrumbs links={props.navigation.breadcrumbs.links} />

        <Spacer />
      </HStack>

      <HStack spacing="5" h="full">
        <JaenFrameToolbarContext.Consumer>
          {({toolbar}) => (
            <>
              {toolbar?.components && toolbar?.components.length > 0 && (
                <HStack spacing="5" h="full">
                  {toolbar?.components?.map(
                    (Component, index) => Component && <Component key={index} />
                  )}
                  <Divider orientation="vertical" />
                </HStack>
              )}
            </>
          )}
        </JaenFrameToolbarContext.Consumer>

        <MenuButton
          leftIcon={<Icon as={FaPlus} color="brand.500" />}
          variant="outline"
          items={props.navigation.addMenu.items}></MenuButton>

        <DrawerRight
          user={props.navigation.user.user}
          navigationGroups={props.navigation.user.navigationGroups}
        />
      </HStack>
    </HStack>
  )

  return (
    <Flex pos="relative" flexDirection="column">
      <HStack
        id="coco"
        as="header"
        bg="bg.subtle"
        {...(!props.navigation.isStickyDisabled && {
          pos: 'sticky',
          top: '0',
          zIndex: 'sticky'
        })}
        h="16"
        p="16px"
        borderBottom="1px"
        borderColor="border.emphasized"
        backdropBlur={8}
        justifyContent="space-between"
        zIndex="sticky">
        <HStack spacing="5" h="full">
          <DrawerLeft
            navigationGroups={props.navigation.app.navigationGroups}
            version={props.navigation.app.version}
            logo={props.navigation.app.logo}
          />
          <Box cursor="pointer" maxW="12rem">
            {props.logo || (
              <JaenLogo h="full" w="auto" transform="scale(1.05)" />
            )}
          </Box>
          <Breadcrumbs links={props.navigation.breadcrumbs.links} />

          <Spacer />
        </HStack>

        <HStack spacing="5" h="full">
          {toolbar?.components && toolbar?.components.length > 0 && (
            <HStack spacing="5" h="full">
              {toolbar?.components?.map(
                (Component, index) => Component && <Component key={index} />
              )}
              <Divider orientation="vertical" />
            </HStack>
          )}

          <MenuButton
            leftIcon={<Icon as={FaPlus} color="brand.500" />}
            variant="outline"
            items={props.navigation.addMenu.items}></MenuButton>

          <DrawerRight
            user={props.navigation.user.user}
            navigationGroups={props.navigation.user.navigationGroups}
          />
        </HStack>
      </HStack>
    </Flex>
  )
}

export default JaenFrame
