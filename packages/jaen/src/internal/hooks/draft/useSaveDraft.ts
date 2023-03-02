import {useCallback, useState} from 'react'
import {prepareMigration} from '../../helper/clientMigration.js'

export const useSaveDraft = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const saveDraft = useCallback(async () => {
    setIsSaving(true)
    const {blob, filename} = await prepareMigration()

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setIsSaving(false)
    setIsSaved(true)

    setTimeout(() => {
      setIsSaved(false)
    }, 2000)
  }, [])

  return {isSaving, isSaved, saveDraft}
}
