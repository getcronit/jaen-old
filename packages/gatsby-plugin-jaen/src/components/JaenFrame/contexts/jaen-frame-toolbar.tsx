import {useStatStyles} from '@chakra-ui/react'
import {ComponentType, createContext, useState} from 'react'

export interface JaenFrameToolbar {
  components: Array<ComponentType<{}>>
  origin: string
}

export interface ToolbarContextProps {
  setToolbar: (toolbar: JaenFrameToolbar | null) => void
  toolbar: JaenFrameToolbar | null
}

export const JaenFrameToolbarContext = createContext<ToolbarContextProps>({
  setToolbar: () => {},
  toolbar: null
})

export const JaenFrameToolbarProvider: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  const [toolbar, setToolbar] = useState<JaenFrameToolbar | null>(null)

  return (
    <JaenFrameToolbarContext.Provider value={{setToolbar, toolbar}}>
      {children}
    </JaenFrameToolbarContext.Provider>
  )
}
