import Button from '@mui/material/Button'
import React from 'react'

type EncodeButtonProps = object

const EncodeButton: React.FC<EncodeButtonProps> = () => {
  return (
    <>
      <Button variant="contained" color="primary" onClick={window.myAPI.startFfmpeg}>
        Encode
      </Button>
    </>
  )
}

export default EncodeButton
