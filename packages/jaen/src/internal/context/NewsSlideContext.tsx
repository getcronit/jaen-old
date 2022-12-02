import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

export interface NewsSlideContextValue {
  ref: React.RefObject<HTMLDivElement> | null
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void

  data: {
    items: {
      id: string
      title: string
      description: string
    }[]
  } | null
  isLoading: boolean
}

export const NewsSlideContext = createContext<NewsSlideContextValue>({
  ref: null,
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onToggle: () => {},

  data: null,
  isLoading: true
})

export interface NewsSlideProviderProps {
  children: React.ReactNode
}

export const NewsSlideProvider: React.FC<NewsSlideProviderProps> = ({
  children
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))

      setData({
        items: [
          {
            id: 1,
            title: 'test',
            description: 'test',
            image: 'https://via.placeholder.com/150'
          },
          {
            id: 2,
            title: 'test',
            description: 'test',
            image: 'https://via.placeholder.com/150'
          }
        ]
      })

      setIsLoading(false)
    }

    if (isOpen && data === null) {
      fetchData()
    }
  }, [isOpen])

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  return (
    <NewsSlideContext.Provider
      value={{
        ref,
        isOpen,
        onOpen,
        onClose,
        onToggle,
        data,
        isLoading
      }}>
      {children}
    </NewsSlideContext.Provider>
  )
}

export const useNewsSlide = () => useContext(NewsSlideContext)
