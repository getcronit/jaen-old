import {useEffect, useState} from 'react'
import {RootState, store} from '../../redux/index.js'

export const useDynamicPaths = () => {
  const [dynamicPaths, setDynamicPaths] = useState<
    RootState['page']['routing']['dynamicPaths']
  >(getDynamicPaths())

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDynamicPaths(getDynamicPaths())
    })

    return unsubscribe
  }, [])

  return dynamicPaths
}
function getDynamicPaths() {
  const state = store.getState() as RootState
  const dynamicPaths = state.page.routing.dynamicPaths
  return dynamicPaths
}
