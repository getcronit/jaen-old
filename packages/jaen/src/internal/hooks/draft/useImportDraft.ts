import {useCallback, useState} from 'react'
import {MigrationData} from '../../../types.js'
import {insertMigration} from '../../helper/clientMigration.js'

interface ImportedFile {
  file: MigrationData
  isImporting: boolean
  isImported: boolean
  handleImportClick: () => void
}

export const useImportDraft = (): ImportedFile => {
  const [file, setFile] = useState<MigrationData>({})
  const [isImporting, setIsImporting] = useState<boolean>(false)
  const [isImported, setIsImported] = useState<boolean>(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsImporting(true)
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    const reader = new FileReader()
    reader.onload = async event => {
      const content = (event.target?.result || '{}') as string

      try {
        const parsed = JSON.parse(content)
        setFile(parsed)
        setIsImported(true)

        await insertMigration(parsed)
      } catch (e) {
        alert('Please upload a valid JSON file.')
        setIsImporting(false)
      }
    }
    reader.readAsText(selectedFile)
  }

  const handleImportClick = useCallback(() => {
    setIsImporting(true)
    setIsImported(false)
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jaen'
    input.onchange = (e: Event) => {
      handleFileSelect(e as any)
    }
    input.click()
  }, [])

  return {
    file,
    isImporting,
    isImported,
    handleImportClick
  }
}
