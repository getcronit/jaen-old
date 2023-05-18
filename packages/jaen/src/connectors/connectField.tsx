import {memo} from 'react'
import {SectionBlockContextType} from '../internal/context/SectionBlockContext.js'
import {useField} from '../internal/hooks/field/useField.js'
import {usePopupField} from '../internal/hooks/field/usePopupField.js'
import {ThemeProvider} from '../internal/styles/ChakraThemeProvider.js'
import {IJaenConnection} from '../types.js'

export interface JaenFieldProps<IDefaultValue> {
  id?: string
  name: string
  defaultValue: IDefaultValue
  style?: React.CSSProperties
  className?: string
  relatedAnchor?: string
  idStrategy?: 'auto' | 'value'
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
  > = ({
    id,
    name,
    defaultValue,
    style,
    className,
    idStrategy = 'auto',
    ...rest
  }) => {
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

    if (!id) {
      if (idStrategy === 'auto') {
        id = name

        if (field.SectionBlockContext) {
          const {path, position} = field.SectionBlockContext

          // Generate a fully qualified name (fqn) by mapping the path array and joining field names with section IDs (if present) using hyphens
          const fqn = path
            .map(p =>
              p.sectionId ? `${p.fieldName}-${p.sectionId}` : p.fieldName
            )
            .join('-')

          // Construct the final id by combining fqn, name, and position using hyphens
          id = `${fqn}-${position}-${name}`
        }
      } else if (idStrategy === 'value') {
        // Strip all HTML and all non-alphanumeric characters from the value and use it as the id
        // Also make sure that spaces are replaced with hyphens

        const value = field.value || field.staticValue || defaultValue

        id = `${value
          .replace(/(<([^>]+)>)/gi, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase()}`
      }
    }

    return (
      <ThemeProvider>
        <Component
          jaenField={{
            id,
            idStrategy,
            name,
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

  MyComp.options = options

  return memo(MyComp)
}

export type IFieldConnection = ReturnType<typeof connectField>
