import {
  Box,
  Button,
  CreateToastFnReturn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  useToast,
  ChakraProvider
} from '@chakra-ui/react'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'

import {useJaenTheme} from './jaen-theme'

enum ModalType {
  Alert,
  Confirm,
  Prompt
}

export interface Notifications {
  alert: (message: string) => Promise<any>
  confirm: (message: string) => Promise<any>
  prompt: (message: string, defaultValue?: string) => Promise<any>
  toast: CreateToastFnReturn
}

const defaultContext: Notifications = {
  alert() {
    throw new Error('<NotificationsProvider> is missing')
  },
  confirm() {
    throw new Error('<NotificationsProvider> is missing')
  },
  prompt() {
    throw new Error('<NotificationsProvider> is missing')
  },
  toast: {} as CreateToastFnReturn
}

const Context = createContext<Notifications>(defaultContext)

interface AnyEvent {
  preventDefault: () => void
}

export const NotificationsProvider = ({children}: {children: ReactNode}) => {
  const toast = useToast({
    position: 'bottom',
    duration: 2000,
    isClosable: true,
    variant: 'subtle'
  })

  const [modal, setModal] = useState<ReactNode | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const ok = useRef<HTMLButtonElement>(null)

  const jaenTheme = useJaenTheme()

  const createOpener = useCallback(
    (type: ModalType) =>
      async (message: string, defaultValue = '') =>
        await new Promise(resolve => {
          const handleClose = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            resolve(null)
          }

          const handleCancel = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            if (type === ModalType.Prompt) resolve(null)
            else resolve(false)
          }

          const handleOK = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            if (type === ModalType.Prompt) resolve(input.current?.value)
            else resolve(true)
          }

          setModal(
            <Modal
              isOpen={true}
              onClose={handleClose}
              initialFocusRef={type === ModalType.Prompt ? input : ok}>
              <ModalOverlay />
              <Box>
                <ModalContent>
                  <ModalBody mt={5}>
                    <Stack spacing={5}>
                      <Text>{message}</Text>
                      {type === ModalType.Prompt && (
                        <Input ref={input} defaultValue={defaultValue} />
                      )}
                    </Stack>
                  </ModalBody>
                  <ModalFooter>
                    {type !== ModalType.Alert && (
                      <Button mr={3} variant="ghost" onClick={handleCancel}>
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleOK} ref={ok}>
                      OK
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Box>
            </Modal>
          )
        }),
    [children]
  )

  return (
    <Context.Provider
      value={{
        alert: createOpener(ModalType.Alert),
        confirm: createOpener(ModalType.Confirm),
        prompt: createOpener(ModalType.Prompt),
        toast
      }}>
      {children}
      <ChakraProvider disableEnvironment disableGlobalStyle theme={jaenTheme}>
        {modal}
      </ChakraProvider>
    </Context.Provider>
  )
}

export const useNotificationsContext = () => useContext(Context)
