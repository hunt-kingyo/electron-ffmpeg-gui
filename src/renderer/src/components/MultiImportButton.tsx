import Button from '@mui/material/Button'
import React from 'react'

type MultiImportButtonProps = {
  inputFileList: string[]
  setInputList: React.Dispatch<React.SetStateAction<string[]>>
}

const MultiImportButton: React.FC<MultiImportButtonProps> = ({ inputFileList, setInputList }) => {
  const handleFileList= async () => {
    let files: string[] = await window.myAPI.openMultipleDialog();
    //重複して追加しないよう、すでに配列に入っているファイルパスを除外
    setInputList((prevList) => [...prevList, ...files.filter((item) => !inputFileList.includes(item))])
    files = []
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