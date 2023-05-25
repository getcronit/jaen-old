import {useEffect, useState} from 'react'
import {RootState, store} from '../../redux/index.js'

export const useDynamicPaths = () => {
  const [dynamicPaths, setDynamicPaths] = useState<
    RootState['page']['routing']['dynamicPaths']
  >(getDynamicPaths())

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newDynamicPaths = getDynamicPaths()

      if (JSON.stringify(newDynamicPaths) !== JSON.stringify(dynamicPaths)) {
        setDynamicPaths(newDynamicPaths)
      }
    })

    return unsubscribe
  }, [])

  return dynamicPaths
}
export function getDynamicPaths() {
  const state = store.getState() as RootState
  const dynamicPaths = state.page.routing.dynamicPaths
  return dynamicPaths
}
