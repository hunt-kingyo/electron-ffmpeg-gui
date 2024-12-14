import Button from '@mui/material/Button'
import React from 'react'

interface EncodeOptions {
  videoCodec:string;
  codecOption:string[];
  containerFormat:string;
  suffix: string;
  outputFolder:string;
}

interface EncodeButtonProps {
  encodeOptions: EncodeOptions;
}

const EncodeButton: React.FC<EncodeButtonProps> = ({ encodeOptions }) => {
  const handleEncode = () => {
    window.myAPI.startFfmpeg(encodeOptions)
  }
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleEncode}>
        Encode
      </Button>
    </>
  )
}

export default EncodeButton
