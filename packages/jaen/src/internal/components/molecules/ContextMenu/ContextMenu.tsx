import {
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuProps,
  Portal,
  PortalProps,
  useEventListener
} from '@chakra-ui/react'
import * as React from 'react'
import {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react'

export enum ContextMenuEvent {
  Open = 'contextmenu.open',
  Close = 'contextmenu.close'
}

export interface ContextMenuProps<T extends HTMLElement> {
  renderMenu: () => JSX.Element | null
  children: (ref: MutableRefObject<T | null>) => JSX.Element | null
  menuProps?: Omit<MenuProps, 'children'> & {children?: React.ReactNode}
  portalProps?: Omit<PortalProps, 'children'> & {children?: React.ReactNode}
  menuButtonProps?: MenuButtonProps
}

export function ContextMenu<T extends HTMLElement = HTMLElement>(
  props: ContextMenuProps<T>
) {
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isDeferredOpen, setIsDeferredOpen] = useState(false)
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const targetRef = useRef<T>(null)

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        setIsRendered(true)
        const timeout = setTimeout(() => {
          setIsDeferredOpen(true)
        })

        return () => {
          clearTimeout(timeout)
        }
      })

      return () => {
        clearTimeout(timeout)
      }
    } else {
      setIsDeferredOpen(false)
      const timeout = setTimeout(() => {
        setIsRendered(isOpen)
      }, 1000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [isOpen])

  const handleEventOpen = useCallback(
    (e: MouseEvent) => {
      if (
        e.detail === 27 ||
        targetRef.current?.contains(e.target as any) ||
        e.target === targetRef.current
      ) {
        // const node = e.target as HTMLElement

        const x = e.clientX
        const y = e.clientY

        console.log('handleEventOpen', e, x, y)

        e.preventDefault()
        setIsOpen(true)
        setPosition([x, y])
      } else {
        setIsOpen(false)
      }
    },
    [targetRef]
  )

  const handleCloseEvent = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEventListener('contextmenu', handleEventOpen)
  useEventListener(ContextMenuEvent.Open, handleEventOpen, targetRef.current)
  useEventListener(ContextMenuEvent.Close, handleCloseEvent, targetRef.current)

  const onCloseHandler = useCallback(() => {
    props.menuProps?.onClose?.()
    setIsOpen(false)
  }, [props.menuProps?.onClose, setIsOpen])

  return (
    <>
      {props.children(targetRef)}
      {isRendered && (
        <Portal {...props.portalProps}>
          <Menu
            isOpen={isDeferredOpen}
            gutter={0}
            {...props.menuProps}
            onClose={onCloseHandler}>
            <MenuButton
              aria-hidden={true}
              w={1}
              h={1}
              style={{
                position: 'absolute',
                left: position[0],
                top: position[1],
                cursor: 'default'
              }}
              {...props.menuButtonProps}
            />
            {props.renderMenu()}
          </Menu>
        </Portal>
      )}
    </>
  )
}
