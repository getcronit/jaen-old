import {useState} from 'react'

function useJSONFileUpload() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e: any) => {
      if (e.target.files) {
        const uploadedFile = e.target.files[0]
        if (uploadedFile.type === 'application/json') {
          setFile(uploadedFile)
        } else {
          alert('Please upload a valid JSON file.')
        }
      }
    }
    input.click()
  }

  return {file, handleFileUpload}
}

export default useJSONFileUpload
