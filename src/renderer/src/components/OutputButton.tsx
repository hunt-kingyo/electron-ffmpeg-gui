import Button from '@mui/material/Button'
import React from 'react'

type OutputButtonProps = {
  setOutputFolder: React.Dispatch<React.SetStateAction<string>>
}

const OutputButton: React.FC<OutputButtonProps> = ({ setOutputFolder }) => {
  const handleFilePath = async () => {
    setOutputFolder(await window.myAPI.openOutputDialog())
  }
  return (
    <>
      <Button variant="contained" color="primary" id="button" onClick={handleFilePath}>
        Select Output Folder
      </Button>
    </>
  )
}

export default OutputButton
