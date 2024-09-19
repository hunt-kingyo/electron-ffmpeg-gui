import Button from '@mui/material/Button'
import React from 'react'

type MultiImportButtonProps = {
  setInputList: React.Dispatch<React.SetStateAction<string[]>>
}

const MultiImportButton: React.FC<MultiImportButtonProps> = ({ setInputList }) => {
  const handleFileList= async () => {
    setInputList(await window.myAPI.openMultipleDialog())
  }
  return (
    <>
      <Button variant="contained" color="primary" id="button" onClick={handleFileList}>
        Select multiple file
      </Button>
    </>
  )
}

export default MultiImportButton