import {useCallback, useState} from 'react'
import {prepareMigration} from '../../helper/clientMigration.js'

export const useSaveDraft = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const saveDraft = useCallback(async () => {
    setIsSaving(true)
    const migrationData = await prepareMigration()

    // migrationData to JSON file
    const blob = new Blob([JSON.stringify(migrationData)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `jaen-draft-${new Date().toISOString()}.jaen`
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
