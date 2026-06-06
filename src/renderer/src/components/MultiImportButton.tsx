import Button from '@mui/material/Button'
import React from 'react'

type MultiImportButtonProps = {
  inputFileList: string[]
  setInputList: React.Dispatch<React.SetStateAction<string[]>>
}

const MultiImportButton: React.FC<MultiImportButtonProps> = ({ inputFileList, setInputList }) => {
  const handleFileList = async () => {
    const files = await window.myAPI.openMultipleDialog()
    if (files === '') return

    setInputList((prevList) => [
      ...prevList,
      ...files.filter((item) => !inputFileList.includes(item))
    ])
  }

  return (
    <>
      <Button variant="contained" color="primary" id="button" onClick={handleFileList}>
        Select files
      </Button>
    </>
  )
}

export default MultiImportButton
