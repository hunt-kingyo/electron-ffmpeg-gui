import Button from '@mui/material/Button'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
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
}

const EncodeButton: React.FC<EncodeButtonProps> = ({ encodeOptions, inputFileList }) => {
  const [isEncoding, setIsEncoding] = React.useState(false)
  const [isStopping, setIsStopping] = React.useState(false)
  const encodingRef = React.useRef(false)
  const validationError =
    inputFileList.length === 0 || inputFileList.some((path) => !path.trim())
      ? 'Select at least one input video.'
      : !encodeOptions.videoCodec.trim()
        ? 'Select a video codec.'
        : !encodeOptions.containerFormat.trim()
          ? 'Select a container format.'
          : !encodeOptions.outputFolder.trim()
            ? 'Select an output folder.'
            : undefined

  const handleEncode = async () => {
    if (encodingRef.current || validationError) return
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
    <Stack spacing={1}>
      {validationError && (
        <Typography variant="body2" color="text.secondary">
          {validationError}
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid size="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEncode}
            disabled={isEncoding || isStopping || !!validationError}
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
