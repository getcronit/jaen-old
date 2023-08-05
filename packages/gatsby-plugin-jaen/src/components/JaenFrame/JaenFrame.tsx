import {Badge, Box, ChakraProvider, HStack, Icon} from '@chakra-ui/react'
import React from 'react'
import {FaPlus} from 'react-icons/fa'
import theme from '../../theme/theme'

import {Link} from '../../components/shared/Link'
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
      isBadgeVisible?: boolean
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
      px="16px"
      borderBottom="1px"
      borderColor="border.emphasized"
      backdropBlur={8}
      justifyContent="space-between"
      zIndex="sticky">
      <HStack spacing="5" w="full" h="full">
        <HStack
          h="full"
          spacing="4"
          w={{
            base: '24',
            md: 'full'
          }}>
          <DrawerLeft
            navigationGroups={props.navigation.app.navigationGroups}
            version={props.navigation.app.version}
            logo={props.navigation.app.logo}
          />

          <Box
            h="full"
            maxW="12rem"
            display={{
              base: 'none',
              md: 'block'
            }}>
            <Link
              to="/"
              textDecoration="none"
              sx={{
                // before
                _before: {
                  content: 'none'
                }
              }}>
              {props.logo || <JaenLogo transform="scale(1.05)" />}
            </Link>
          </Box>

          <Box
            display={{
              base: 'none',
              md: 'block'
            }}>
            <Breadcrumbs links={props.navigation.breadcrumbs.links} />
          </Box>
        </HStack>

        <Box mx="auto" h="full">
          <Box
            h="full"
            maxW="12rem"
            display={{
              base: 'block',
              md: 'none'
            }}>
            <Link
              to="/"
              textDecoration="none"
              sx={{
                // before
                _before: {
                  content: 'none'
                }
              }}>
              {props.logo || (
                <JaenLogo h="full" w="auto" transform="scale(1.05)" />
              )}
            </Link>
          </Box>
        </Box>

        <HStack
          spacing={4}
          w={{
            base: '24',
            md: 'xs'
          }}
          h="full"
          justifyContent="end">
          <HStack
            h="full"
            spacing={4}
            display={{
              base: 'none',
              md: 'flex'
            }}>
            <MenuButton
              leftIcon={<Icon as={FaPlus} color="brand.500" />}
              variant="outline"
              items={props.navigation.addMenu.items}
            />
          </HStack>

          <DrawerRight
            user={props.navigation.user.user}
            navigationGroups={props.navigation.user.navigationGroups}
            isBadgeVisible={props.navigation.user.isBadgeVisible}
          />
        </HStack>
      </HStack>
    </HStack>
  )
}

export default JaenFrame
