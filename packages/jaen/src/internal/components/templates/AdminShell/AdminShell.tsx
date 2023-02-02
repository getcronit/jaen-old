import {Box} from '@chakra-ui/react'
import {NewsSlideProvider} from '../../../context/NewsSlideContext.js'
import {NewsSlide} from '../../molecules/index.js'
import {AdminToolbar} from '../../organisms/index.js'

export interface AdminShellProps {
  beforeAdminShell?: React.ReactNode
  contentOffset?: string | number
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

  const marginTop = props.contentOffset ? `calc(${props.contentOffset})` : 14

  return (
    <>
      <NewsSlideProvider>
        <Box pos="fixed" top="0" w="full" zIndex={2}>
          <AdminToolbar withoutShadow={props.withoutAdminToolbarShadow} />
          {props.beforeAdminShell}
        </Box>

        <Box pt={marginTop} pos="relative">
          <NewsSlide
            top="0"
            right="0"
            mt={marginTop}
            pos="fixed"
            zIndex={1}
            h={`calc(100vh - ${
              props.contentOffset || 'var(--chakra-sizes-14)'
            })`}
          />
          <Box zIndex={0} position="relative">
            {props.children}
          </Box>
        </Box>
      </NewsSlideProvider>
    </>
  )
}
