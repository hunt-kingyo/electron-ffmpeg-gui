import Button from '@mui/material/Button'
import React from 'react'
import Stack from '@mui/material/Stack'

interface EncodeOptions {
  videoCodec: string
  codecOption: string[]
  containerFormat: string
  suffix: string
  outputFolder: string
}

interface AllOptions {
  inputFileList: string[]
  videoCodec: string
  codecOption: string[]
  containerFormat: string
  suffix: string
  outputFolder: string
}

interface EncodeButtonProps {
  encodeOptions: EncodeOptions
  inputFileList: string[]
}

const EncodeButton: React.FC<EncodeButtonProps> = ({ encodeOptions, inputFileList }) => {
  const [isEncoding, setIsEncoding] = React.useState(false)
  const [isStopping, setIsStopping] = React.useState(false)
  const encodingRef = React.useRef(false)

  const handleEncode = async () => {
    if (encodingRef.current) return
    encodingRef.current = true
    setIsEncoding(true)
    const allOptions: AllOptions = {
      ...encodeOptions,
      codecOption: [...encodeOptions.codecOption], // 配列のディープコピー
      inputFileList
    }
    try {
      await window.myAPI.startFfmpeg(allOptions)
    } catch (error) {
      console.error('Failed to start ffmpeg:', error)
    } finally {
      encodingRef.current = false
      setIsEncoding(false)
    }
  }

  const handleStop = async () => {
    setIsStopping(true)
    try {
      await window.myAPI.stopFfmpeg()
    } catch (error) {
      console.error('Failed to stop ffmpeg:', error)
    } finally {
      setIsStopping(false)
    }
  }
  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleEncode}
        disabled={isEncoding || isStopping}
      >
        Encode
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={handleStop}
        disabled={!isEncoding || isStopping}
      >
        {isStopping ? 'Stopping…' : 'Stop'}
      </Button>
    </Stack>
  )
}

export default EncodeButton
