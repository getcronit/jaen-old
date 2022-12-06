import {ThemeProvider} from '@emotion/react'
import {memo, useEffect} from 'react'
import {useAuth} from '../internal/hooks/auth/useAuth.js'
import {useField} from '../internal/hooks/field/useField.js'
import theme from '../internal/styles/theme.js'
import {IJaenConnection} from '../types.js'
import {cleanObject} from '../utils/cleanObject.js'

export interface JaenFieldProps<IDefaultValue> {
  name: string
  displayName?: string
  defaultValue: IDefaultValue
  style?: React.CSSProperties
  className?: string
}

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
  > = props => {
    const RegisterHelper: React.FC = () => {
      const field = useField<IValue>(props.name, options.fieldType)

      const {isAuthenticated} = useAuth()

      useEffect(() => {
        if (isAuthenticated) {
          // clean up props to prevent circular reference, react items or other issues in redux store / local storage
          field.register(cleanObject(props))
        }
      }, [isAuthenticated])

      return (
        <ThemeProvider theme={theme}>
          <Component
            jaenField={{
              name: props.name,
              defaultValue: props.defaultValue,
              staticValue: field.staticValue,
              value: field.value,
              isEditing: field.isEditing,
              onUpdateValue: field.write,
              style: props.style,
              className: props.className
            }}
            {...props}
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
