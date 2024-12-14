import React from 'react'
import MultiImportButton from './components/MultiImportButton'
import SelectVideoCodec from './components/SelectVideoCodec'
import SelectCodecOption from './components/SelectCodecOption'
import SelectContainerFormat from './components/SelectContainerFormat'
import EncodeButton from './components/EncodeButton'
import OutputButton from './components/OutputButton'
import { useEncodeOptions } from './components/useEncodeOptions'
import { Box, Grid2, Stack } from '@mui/material'

function App(): JSX.Element {

  const [inputFileList, setInputList] = React.useState<string[]>([])
  const inputListMap = inputFileList ? inputFileList.map((filePath) => <li key={filePath}>{filePath}</li>) : 'file is not selected'

  const {
    encodeOptions,
    setVideoCodec,
    setCodecOption,
    setContainerFormat,
    setPixelFormat,
    setVideoBitrate,
    setSuffix,
    setOutputFolder
  } = useEncodeOptions();

  return (
    <div>
      <Grid2 container spacing={2}>
        <Grid2 size={8}>
          <Stack spacing={0.5}>
            <MultiImportButton setInputList={setInputList} />
            <Box sx={{height:400, bgcolor:'#4c4c4c', overflowY:'auto'}}>
              <div className="text">{inputListMap}</div>
            </Box>
          </Stack>
        </Grid2>
        <Grid2 size={4}>
          <Stack spacing={0.5}>
          <SelectVideoCodec onVideoCodecChange={setVideoCodec} videoCodec={encodeOptions.videoCodec} />
          {encodeOptions.videoCodec}
          <br />
          <select id="suffixSelect">
            <option value="">(none)</option>
            <option value="_codec">_codec</option>
            <option value="_bitrate">_bitrate</option>
            <option value="_converted">_converted</option>
            <option value="_FFmpegGUI">_FFmpegGUI</option>
          </select>
          <SelectCodecOption onCodecOptionChange={setCodecOption} videoCodec={encodeOptions.videoCodec} />
          {encodeOptions.codecOption}
          <br />
          <SelectContainerFormat onContainerFormatChange={setContainerFormat} videoCodec={encodeOptions.videoCodec} />
          {encodeOptions.containerFormat}
          <br />
          <OutputButton onOutputFolderChange={setOutputFolder} />
          <div className='text'>{encodeOptions.outputFolder}</div>
          <EncodeButton encodeOptions={encodeOptions}/>
          <p id="checkFilePath" />
          
          </Stack>
        </Grid2>
      </Grid2>
    </div>
  )
}

export default App
