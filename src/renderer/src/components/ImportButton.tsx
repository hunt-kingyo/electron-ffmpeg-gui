import Button from '@mui/material/Button'
import React from 'react'

type ImportButtonProps = {
  setInputFile: React.Dispatch<React.SetStateAction<string>>
}

const ImportButton: React.FC<ImportButtonProps> = ({ setInputFile }) => {
  const handleFilePath = async () => {
    setInputFile(await window.myAPI.openDialog())
  }
  return (
    <>
      <Button variant="contained" color="primary" id="button" onClick={handleFilePath}>
        Select file
      </Button>
    </>
  )
}

export default ImportButton
