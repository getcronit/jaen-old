import {useEffect, useRef} from 'react'

export const useScrollToElement = () => {
  const targetRef = useRef(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const id = url.hash.slice(1) // Remove the '#' symbol from the ID

    if (id) {
      const targetElement = document.getElementById(id)
      if (targetElement) {
        console.log('Scrolling to element', targetElement)
        targetElement.scrollIntoView({behavior: 'auto'})
      }
    }
  }, [])

  return {targetRef}
}
