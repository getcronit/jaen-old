import {useWidgetStaticQuery} from 'gatsby-plugin-jaen'
import React from 'react'
import {store} from '../redux/index.js'
import * as widgetActions from '../redux/slices/widget.js'
import {IJaenState} from '../redux/types.js'

const getWidgetData = (widgetName: string) => {
  const state = store.getState() as IJaenState
  return state.widget.nodes.find(widget => widget.name === widgetName)?.data
}

const useWidgetStateFromStore = (widgetName: string) => {
  const [state, setState] = React.useState(getWidgetData(widgetName))

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(getWidgetData(widgetName))
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return state
}

export function useWidget<T extends object>(widgetName: string) {
  const dynamicData = useWidgetStateFromStore(widgetName) as T

  const {jaenInternal} = useWidgetStaticQuery()

  const staticData = React.useMemo(() => {
    const widget = jaenInternal?.widgets?.find(node => node.name === widgetName)

    if (widget) {
      return widget.data
    }

    return undefined
  }, [jaenInternal.widgets, widgetName])

  const data = React.useMemo(() => {
    if (dynamicData) {
      return dynamicData
    }

    return staticData
  }, [dynamicData, staticData]) as T

  const writeData = (data: T) =>
    store.dispatch(
      widgetActions.writeData({
        widgetName,
        data
      })
    )

  return {
    data,
    writeData
  }
}
