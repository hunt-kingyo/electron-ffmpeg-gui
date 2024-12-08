import Button from '@mui/material/Button'
import React from 'react'

interface OutputButtonProps {
  onOutputFolderChange: (outputFolder: string) => void;
}

const OutputButton: React.FC<OutputButtonProps> = ({ onOutputFolderChange }) => {
  const handleFilePath = async () => {
    onOutputFolderChange(await window.myAPI.openOutputDialog())
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
