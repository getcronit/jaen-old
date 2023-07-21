import {ComponentType, createContext} from 'react'

export interface Toolbar {
  components: Array<ComponentType<{}>>
  origin: string
}

export interface ToolbarContextProps {
  setToolbar: (toolbar: Toolbar | null) => void
}

export const ToolbarContext = createContext<ToolbarContextProps>({
  setToolbar: () => {}
})
