import {Box, Flex} from '@chakra-ui/react'
import {NewsSlideProvider} from '../../../context/NewsSlideContext.js'
import {NewsSlide} from '../../molecules/index.js'
import {AdminToolbar} from '../../organisms/AdminToolbar/AdminToolbar.js'

export interface AdminShellProps {
  beforeAdminShell?: React.ReactNode
  children: React.ReactNode
  renderChildrenAsIframe?: boolean
  withoutAdminToolbarShadow?: boolean
}

export const AdminShell: React.FC<AdminShellProps> = props => {
  // disable SSR for this component
  // const isSSR = typeof window === 'undefined'

  // if (isSSR) {
  //   return null
  // }

  // const shouldBypass = window.location.search.includes(
  //   '__bypass_jaen_shell=true'
  // )

  // const getWindowUrlWithBypass = () => {
  //   const url = new URL(window.location.href)
  //   url.searchParams.set('__bypass_jaen_shell', 'true')
  //   return url.toString()
  // }

  // if (shouldBypass) {
  //   return <>{props.children}</>
  // }

  // const iframeUrl = getWindowUrlWithBypass()

  // return (
  //   <Flex flexDir={'column'} h="100vh">
  //     <AdminToolbar
  //       onNewsClick={() => {}}
  //       withoutShadow={props.withoutAdminToolbarShadow}
  //     />
  //     <Box flex="1">
  //       {props.renderChildrenAsIframe ? (
  //         <iframe
  //           src={iframeUrl}
  //           style={{
  //             width: '100%',
  //             height: '100%'
  //           }}
  //         />
  //       ) : (
  //         props.children
  //       )}
  //     </Box>
  //   </Flex>
  // )

  return (
    <Flex flexDir="column" h="100vh" position="relative">
      <NewsSlideProvider>
        <Box zIndex={2}>
          <AdminToolbar withoutShadow={props.withoutAdminToolbarShadow} />
          {props.beforeAdminShell}
        </Box>

        <Flex
          zIndex={1}
          id="__jaen_admin_shell"
          flex="1"
          overflowY="auto"
          sx={{
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: '3px'
            }
          }}>
          <NewsSlide zIndex={2} />

          {props.children}
        </Flex>
      </NewsSlideProvider>
    </Flex>
  )
}
