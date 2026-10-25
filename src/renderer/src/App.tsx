import React, { JSX } from 'react'
import MultiImportButton from './components/MultiImportButton'
import InputListDisplay from './components/InputListDisplay'
import SelectVideoCodec from './components/SelectVideoCodec'
import SelectCodecOption from './components/SelectCodecOption'
import SelectContainerFormat from './components/SelectContainerFormat'
import SelectSuffix from './components/SelectSuffix'
import OutputButton from './components/OutputButton'
import OptionDisplay from './components/OptionDisplay'
import EncodeButton from './components/EncodeButton'
import { useEncodeOptions } from './components/useEncodeOptions'
import { Box, Button, Grid, Stack } from '@mui/material'
import FFmpegLogDisplay from './components/FFmpegLogDisplay'

function App(): JSX.Element {
  const [inputFileList, setInputList] = React.useState<string[]>([])

  const {
    encodeOptions,
    setVideoCodec,
    setCodecOption,
    setContainerFormat,
    setSuffix,
    setOutputFolder
  } = useEncodeOptions()

  return (
    <>
      <Stack spacing={1}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Stack spacing={1}>
              <Grid container spacing={2}>
                <Grid size={'auto'}>
                  <MultiImportButton inputFileList={inputFileList} setInputList={setInputList} />
                </Grid>
                <Grid size={'grow'}>
                  <Box></Box>
                </Grid>
                <Grid size={'auto'}>
                  <Button variant="outlined" color="warning" onClick={() => setInputList([])}>
                    Reset File Select
                  </Button>
                </Grid>
              </Grid>
              <InputListDisplay inputFileList={inputFileList} setInputList={setInputList} />
            </Stack>
          </Grid>
          <Grid size={4}>
            <Stack spacing={1}>
              <SelectVideoCodec
                onVideoCodecChange={setVideoCodec}
                videoCodec={encodeOptions.videoCodec}
              />
              <SelectCodecOption
                codecOption={encodeOptions.codecOption}
                onCodecOptionChange={setCodecOption}
                videoCodec={encodeOptions.videoCodec}
              />
              <SelectContainerFormat
                containerFormat={encodeOptions.containerFormat}
                onContainerFormatChange={setContainerFormat}
                videoCodec={encodeOptions.videoCodec}
              />
              <SelectSuffix
                onSuffixChange={setSuffix}
                suffix={encodeOptions.suffix}
                videoCodec={encodeOptions.videoCodec}
              />
              <OutputButton onOutputFolderChange={setOutputFolder} />
              <OptionDisplay encodeOptions={encodeOptions} />
              <EncodeButton encodeOptions={encodeOptions} inputFileList={inputFileList} />
            </Stack>
          </Grid>
        </Grid>
        <FFmpegLogDisplay />
      </Stack>
    </>
  )
}

export default App
