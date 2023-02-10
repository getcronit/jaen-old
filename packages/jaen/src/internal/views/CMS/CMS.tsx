import {
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import {GiRuleBook} from 'react-icons/gi'
import {
  Link as RouteLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import {ViewLayout} from '../../components/organisms/index.js'
import {FilesView} from '../FilesView.js'
import {PagesView} from '../PagesView.js'
import {PopupsView} from '../PopupsView.js'
import {SettingsView} from '../SettingsView.js'

interface RouteType {
  name: string
  path: string
  render: () => JSX.Element
}

export interface CMSProps {
  routes: RouteType[]
  children?: React.ReactNode
}

const CMSComponent: React.FC<CMSProps> = props => {
  const location = useLocation()

  console.log('location', location)

  const isActive = (path: string) => {
    return location.pathname.endsWith(path)
  }

  return (
    <Flex>
      <Box
        zIndex={1}
        w="48"
        top="0"
        left="0"
        bg="gray.50"
        pos="fixed"
        h="calc(100vh - var(--chakra-sizes-14) * 2)"
        mt="calc(var(--chakra-sizes-14) * 2)"
        p="4"
        boxShadow="inner">
        <Stack spacing="8">
          <HStack>
            <Circle size="10" bg="white" boxShadow="md">
              <Icon as={GiRuleBook} />
            </Circle>
            <Text fontSize="sm" fontWeight="bold">
              Site <br /> Management
            </Text>
          </HStack>

          <Stack p="2">
            {props.routes.map(route => {
              return (
                <Link
                  as={RouteLink}
                  key={route.path}
                  to={route.path}
                  variant={isActive(route.path) ? '' : 'black'}
                  fontSize="sm">
                  {route.name}
                </Link>
              )
            })}
          </Stack>
        </Stack>
      </Box>
      <Box flex="1" ml="48">
        {props.children}
      </Box>
    </Flex>
  )
}

export const CMS = () => {
  const routes = [
    {
      name: 'Pages',
      path: 'pages',
      render: () => <PagesView />
    },
    {
      name: 'Files',
      path: 'files',
      render: () => <FilesView />
    },
    {
      name: 'Popups',
      path: 'popups',
      render: () => <PopupsView />
    },
    {
      name: 'Settings',
      path: 'settings',
      render: () => <SettingsView />
    }
  ]

  return (
    <Routes>
      <Route
        element={
          <CMSComponent routes={routes}>
            <Outlet />
          </CMSComponent>
        }>
        <Route
          path="/"
          element={routes[0]?.path && <Navigate to={routes[0].path} replace />}
        />
        {routes.map(route => {
          console.log('route', route)

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ViewLayout heading={route.name}>{route.render()}</ViewLayout>
              }
            />
          )
        })}

        <Route
          key="404"
          path="*"
          element={<p>There&apos;s nothing here: 404!</p>}
        />
      </Route>

      {/* <Route key="*" path="*" element={<Navigate to="/404" replace />} /> */}
    </Routes>
  )
}
