import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import {
  Avatar,
  Button,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  StackProps,
  Text,
  Tooltip
} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {useEffect} from 'react'
import {AiOutlineUser} from 'react-icons/ai'
import {FaFileImport, FaGithub, FaSignOutAlt} from 'react-icons/fa'
import {IoHelpBuoySharp, IoNewspaperSharp} from 'react-icons/io5'
import {useAuthentication} from '../../../context/AuthenticationContext.js'
import {useModals} from '../../../context/Modals/ModalContext.js'
import {useNewsSlide} from '../../../context/NewsSlideContext.js'
import {useImportDraft} from '../../../hooks/draft/useImportDraft.js'
import {JaenLogo} from '../../atoms/index.js'
import {ActionBar} from '../../molecules/ActionBar/index.js'

export interface AdminToolbarProps extends StackProps {
  withoutShadow?: boolean
}

export const AdminToolbar = ({
  withoutShadow,
  ...stackProps
}: AdminToolbarProps) => {
  const isOnJaenAdmin =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin')

  const newsSlide = useNewsSlide()

  const {toast} = useModals()

  const {logout, isLoading, user} = useAuthentication()

  const {handleImportClick, isImported} = useImportDraft()

  useEffect(() => {
    if (isImported) {
      window.location.reload()

      toast({
        title: 'Draft imported',
        description: 'Your draft has been imported',
        status: 'success'
      })
    }
  }, [isImported])

  return (
    <HStack
      {...stackProps}
      spacing={{
        base: 0,
        md: 2,
        lg: 4,
        xl: 8
      }}
      alignItems="center"
      justifyContent="space-between"
      bg="gray.800"
      position="relative"
      w="full"
      boxShadow={withoutShadow ? undefined : 'xl'}
      color="white"
      h={14}
      py={{base: 2}}
      px={{base: 4}}
      align="center">
      <Button
        minW="unset"
        display="flex"
        alignItems="center"
        rounded="full"
        // bg="gray.900"
        // color="white"
        variant="darkGhost"
        px="3"
        py="1"
        fontSize="sm"
        userSelect="none"
        cursor="pointer"
        outline="0"
        transition="all 0.2s"
        // _hover={{bg: 'pink.50'}}
        // _active={{bg: 'pink.100'}}
        onClick={() => {
          void navigate(isOnJaenAdmin ? '/' : '/admin')
        }}>
        <HStack flex="1" spacing="2">
          {isOnJaenAdmin ? <ChevronLeftIcon /> : <ChevronRightIcon />}

          <JaenLogo w="10" h="full" color="white" />

          <Text
            textAlign="left"
            minW="24"
            fontWeight="bold"
            fontFamily="monospace">
            {isOnJaenAdmin ? 'Jaen Site' : 'Jaen Admin'}{' '}
          </Text>
        </HStack>
      </Button>

      <ActionBar />

      <HStack>
        <Menu>
          <Tooltip label="Need help?">
            <MenuButton
              as={IconButton}
              aria-label="Help"
              icon={<Icon as={IoHelpBuoySharp} boxSize="5" />}
              variant="darkGhost"
              fontSize="xl"
              onClick={newsSlide.onClose}
            />
          </Tooltip>

          <MenuList color="black">
            <HStack p="2" justifyContent="space-between" fontWeight="bold">
              <Text>Help</Text>
              <Text>v 3.0.0</Text>
            </HStack>

            <MenuDivider />

            <MenuItem as={Link} disabled={true}>
              Jaen documentation
            </MenuItem>
            <MenuItem as={Link} disabled={true}>
              Ask snek
            </MenuItem>

            <MenuItem>
              <HStack>
                <FaGithub />
                <Link
                  href="https://github.com/snek-at/jaen/issues/new/choose"
                  isExternal>
                  Open an issue in GitHub
                </Link>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>

        <Tooltip label="What's new at Jaen">
          <IconButton
            aria-label="News"
            icon={<Icon as={IoNewspaperSharp} boxSize="5" />}
            variant="darkGhost"
            fontSize="xl"
            isActive={newsSlide.isOpen}
            onClick={newsSlide.onToggle}
          />
        </Tooltip>

        <Menu>
          <Tooltip label="Menu">
            <MenuButton
              as={IconButton}
              aria-label="Account"
              icon={<Avatar boxSize="6" size="sm" name="Nico Schett" />}
              variant="darkGhost"
              fontSize="xl"
              isLoading={isLoading}
              onClick={newsSlide.onClose}
            />
          </Tooltip>

          <MenuList color="black">
            <HStack p="2" justifyContent="space-between" fontWeight="bold">
              <Text>{user?.username}</Text>
              <Text></Text>
            </HStack>

            <MenuDivider />

            <MenuItem as={Link} disabled={true}>
              Jaen documentation
            </MenuItem>
            <MenuItem icon={<AiOutlineUser />}>Edit profile</MenuItem>

            <MenuItem icon={<FaFileImport />} onClick={handleImportClick}>
              Import savefile
            </MenuItem>

            <MenuDivider />

            <MenuItem
              icon={<FaSignOutAlt />}
              onClick={() => {
                void logout()
              }}>
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  )
}
