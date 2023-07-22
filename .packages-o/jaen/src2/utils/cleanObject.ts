import {isValidElement} from 'react'

export function cleanObject<T>(obj: T): T {
  const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (_key: any, value: object | null) => {
      if (isValidElement(value)) {
        return
      }

      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return
        }
        seen.add(value)
      }
      return value
    }
  }

  return JSON.parse(JSON.stringify(obj, getCircularReplacer()))
}
