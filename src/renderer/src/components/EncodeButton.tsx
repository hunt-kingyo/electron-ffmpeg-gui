import Button from '@mui/material/Button'
import React from 'react'

interface EncodeOptions {
  videoCodec:string;
  codecOption:string[];
  containerFormat:string;
  suffix: string;
  outputFolder:string;
}

interface AllOptions {
  inputFileList:string[]
  videoCodec:string;
  codecOption:string[];
  containerFormat:string;
  suffix: string;
  outputFolder:string;
}

interface EncodeButtonProps {
  encodeOptions: EncodeOptions;
  inputFileList: string[];
}


const EncodeButton: React.FC<EncodeButtonProps> = ({ encodeOptions, inputFileList }) => {
  const handleEncode = () => {
    const allOptions: AllOptions = {
      ...encodeOptions,
      codecOption: [...encodeOptions.codecOption], // 配列のディープコピー
      inputFileList
    };
    window.myAPI.startFfmpeg(allOptions)
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
