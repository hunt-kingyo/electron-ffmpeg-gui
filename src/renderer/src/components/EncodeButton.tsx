import Button from '@mui/material/Button'
import React from 'react'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

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
  onEncodeStart: () => void
}

const EncodeButton: React.FC<EncodeButtonProps> = ({
  encodeOptions,
  inputFileList,
  onEncodeStart
}) => {
  const [isEncoding, setIsEncoding] = React.useState(false)
  const [isStopping, setIsStopping] = React.useState(false)
  const encodingRef = React.useRef(false)
  const isInvalid =
    inputFileList.length === 0 ||
    inputFileList.some((path) => !path.trim()) ||
    !encodeOptions.videoCodec.trim() ||
    !encodeOptions.containerFormat.trim() ||
    !encodeOptions.outputFolder.trim()

  const handleEncode = async () => {
    if (encodingRef.current || isInvalid) return
    encodingRef.current = true
    setIsEncoding(true)
    const allOptions: AllOptions = {
      ...encodeOptions,
      codecOption: [...encodeOptions.codecOption], // 配列のディープコピー
      inputFileList
    }
    try {
      onEncodeStart()
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
    <Stack spacing={1}>
      <Grid container spacing={2}>
        <Grid size="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEncode}
            disabled={isEncoding || isStopping || isInvalid}
          >
            Encode
          </Button>
        </Grid>
        <Grid size="grow">
          <Box />
        </Grid>
        <Grid size="auto">
          <Button
            variant="outlined"
            color="error"
            onClick={handleStop}
            disabled={!isEncoding || isStopping}
          >
            {isStopping ? 'Stopping…' : 'Stop'}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default EncodeButton
