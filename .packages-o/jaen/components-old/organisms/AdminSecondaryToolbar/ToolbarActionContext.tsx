import {createContext, useContext, useState} from 'react'

export const ToolbarActionContext = createContext<{
  actions: React.ReactNode[]
  register: (elements: React.ReactNode[]) => void
}>({
  actions: [],
  register: () => {}
})

export const useToolbarActions = () => {
  const context = useContext(ToolbarActionContext)

  if (!context) {
    throw new Error(
      'useToolbarActions must be used within a ToolbarActionProvider'
    )
  }

  return context
}

export interface ToolbarActionProviderProps {
  children: React.ReactNode
}

export const ToolbarActionProvider: React.FC<ToolbarActionProviderProps> = ({
  children
}) => {
  const [elements, setElements] = useState<React.ReactNode[]>([])

  return (
    <ToolbarActionContext.Provider
      value={{
        actions: elements,
        register: (elements: React.ReactNode[]) => {
          setElements(elements)
        }
      }}>
      {children}
    </ToolbarActionContext.Provider>
  )
}
