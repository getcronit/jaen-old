import {memo, useEffect} from 'react'
import {SectionBlockContextType} from '../internal/context/SectionBlockContext.js'
import {useAuth} from '../internal/hooks/auth/useAuth.js'
import {useField} from '../internal/hooks/field/useField.js'
import {usePopupField} from '../internal/hooks/field/usePopupField.js'
import {ThemeProvider} from '../internal/styles/ChakraThemeProvider.js'
import {IJaenConnection} from '../types.js'
import {cleanObject} from '../utils/cleanObject.js'

export interface JaenFieldProps<IDefaultValue> {
  name: string
  label: string
  defaultValue: IDefaultValue
  style?: React.CSSProperties
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldOptions<_IValue, _IDefaultValue, _IProps = {}> {
  fieldType: string
}
/**
 * @function connectField - Connects a field to Jaen.
 *
 * @param Component The component to wrap
 *
 * @example
 * ```
 * const T = connectField<string>(props => {
 *   const {name, defaultValue, style, className} = props.jaenField
 *   return null
 * })
 * ```
 */

export const connectField = <IValue, IDefaultValue = IValue, P = {}>(
  Component: React.ComponentType<
    React.PropsWithChildren<
      P & {
        jaenField: JaenFieldProps<IDefaultValue> & {
          staticValue?: IValue
          value?: IValue
          isEditing: boolean
          onUpdateValue: (value: IValue) => void
        }
      }
    >
  >,
  options: FieldOptions<IValue, IDefaultValue, P>
) => {
  const MyComp: IJaenConnection<
    P & JaenFieldProps<IDefaultValue>,
    typeof options
  > = ({name, label, defaultValue, style, className, ...rest}) => {
    const RegisterHelper: React.FC = () => {
      let field: {
        register: any
        staticValue: any
        value: any
        isEditing: any
        write: any
        jaenPopupId?: string
        jaenPageId?: string
        SectionBlockContext?: SectionBlockContextType | undefined
      }

      try {
        field = usePopupField<IValue>(name, options.fieldType)
      } catch {
        field = useField<IValue>(name, options.fieldType)
      }

      const {isAuthenticated} = useAuth()

      useEffect(() => {
        if (isAuthenticated) {
          // clean up props to prevent circular reference, react items or other issues in redux store / local storage
          field.register(cleanObject(rest))
        }
      }, [isAuthenticated])

      return (
        <ThemeProvider>
          <Component
            jaenField={{
              name,
              label,
              defaultValue,
              staticValue: field.staticValue,
              value: field.value,
              isEditing: field.isEditing,
              onUpdateValue: field.write,
              style,
              className
            }}
            {...(rest as P)}
          />
        </ThemeProvider>
      )
    }

    return <RegisterHelper />
  }

  MyComp.options = options

  return memo(MyComp)
}

export type IFieldConnection = ReturnType<typeof connectField>
