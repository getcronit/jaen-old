import {IPopupOptions, PopupProvider} from '../internal/context/PopupContext.js'
import {IJaenConnection, IJaenPopup} from '../types.js'

export const connectPopup = <
  P extends {
    id: string
    popup?: IJaenPopup
    forceOpen?: boolean
    edtiable?: boolean
    onClose?: () => void
  }
>(
  Component: React.ComponentType<P>,
  options: IPopupOptions
) => {
  const MyComp: IJaenConnection<P, typeof options> = props => {
    return (
      <PopupProvider
        id={props.id}
        popup={props.popup}
        forceOpen={props.forceOpen}
        editable={props.edtiable}
        onClose={props.onClose}
        {...options}>
        <Component {...props} />
      </PopupProvider>
    )
  }

  MyComp.options = options

  return MyComp
}

export type IPopupConnection = ReturnType<typeof connectPopup>
