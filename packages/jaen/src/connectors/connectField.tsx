import React, {useCallback} from 'react'
import {TuneSelectorProps} from '../internal/components/index.js'
import {SectionBlockContextType} from '../internal/context/SectionBlockContext.js'
import {useField} from '../internal/hooks/field/useField.js'
import {usePopupField} from '../internal/hooks/field/usePopupField.js'
import {IJaenConnection} from '../types.js'

export interface JaenFieldProps {
  id?: string
  name: string
  style?: React.CSSProperties
  className?: string
  relatedName?: string
  idStrategy?: 'auto' | 'value'
  tunes?: TuneSelectorProps['tunes']
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldOptions<_IValue, _IProps = {}> {
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
 *   const {name, style, className} = props.jaenField
 *   return null
 * })
 * ```
 */

export const connectField = <IValue, P = {}>(
  Component: React.ComponentType<
    React.PropsWithChildren<
      P & {
        jaenField: JaenFieldProps & {
          staticValue?: IValue
          value?: IValue
          isEditing: boolean
          onUpdateValue: (value: IValue | undefined) => void
          register: (props: Record<string, any>) => void

          tuneProps: TuneSelectorProps['tuneProps']
          tune: (props: TuneSelectorProps['tuneProps']) => void
        }
      }
    >
  >,
  options: FieldOptions<IValue, P>
) => {
  const MyComp: IJaenConnection<P & JaenFieldProps, typeof options> = ({
    id,
    name,
    style,
    className,
    idStrategy = 'auto',
    relatedName,
    tunes,
    ...rest
  }) => {
    console.log('Rest', rest, tunes)
    let field: {
      register: any
      staticValue: any
      value: any
      isEditing: any
      write: any
      jaenPopupId?: string
      jaenPageId?: string
      SectionBlockContext?: SectionBlockContextType | undefined
      props?: Record<string, any>
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

        const value = field.value || field.staticValue

        if (value) {
          id = `${value
            .replace(/(<([^>]+)>)/gi, '')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()}`
        }
      }

      if (!id) {
        // fallback to name
        id = name
      }
    }

    // useEffect(() => {
    //   // skip initial render

    //   if (!field.isEditing) return

    //   field.register({id, relatedName})
    // }, [id, relatedName, field.isEditing])

    const register = useCallback(
      (newProps: Record<string, any>) => {
        field.register({
          id,
          relatedName,
          ...field.props,
          ...newProps
        })
      },
      [id, relatedName, field.props]
    )

    const tune = useCallback(
      (props: Record<string, any>) => {
        register({
          tuneProps: {
            ...field.props?.tuneProps,
            ...props
          }
        })
      },
      [field.props?.tuneProps, register]
    )

    console.log('Field props', field)

    return (
      <Component
        jaenField={{
          id,
          idStrategy,
          name,
          staticValue: field.staticValue,
          value: field.value,
          isEditing: field.isEditing,
          onUpdateValue: field.write,
          register,
          tune,
          style,
          className,
          relatedName,
          tunes,
          tuneProps: field.props?.tuneProps || {}
        }}
        {...(rest as P)}
      />
    )
  }

  MyComp.options = options

  return React.memo(MyComp)
}

export type IFieldConnection = ReturnType<typeof connectField>
