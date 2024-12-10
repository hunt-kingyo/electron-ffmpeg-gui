import React from 'react'
import ImportButton from './components/ImportButton'
import MultiImportButton from './components/MultiImportButton'
import SelectVideoCodec from './components/SelectVideoCodec'
import SelectCodecOption from './components/SelectCodecOption'
import SelectContainerFormat from './components/SelectContainerFormat'
import EncodeButton from './components/EncodeButton'
import OutputButton from './components/OutputButton'
import { useEncodeOptions } from './components/useEncodeOptions'
import { Box, Grid, Grid2, Stack } from '@mui/material'

function App(): JSX.Element {

  const [inputFilePath, setInputFile] = React.useState<string>('')
  const [inputFileList, setInputList] = React.useState<string[]>([])
  //const [ffmpegLog, setffmpegLog] = React.useState<string>('')
  const inputListMap = inputFileList.map((filePath) => <li key={filePath}>{filePath}</li>)

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
      <div className="actions">
        <Grid2 container spacing={2}>
          <Grid2 size={8}>
            <Stack spacing={0.5}>
              <ImportButton  setInputFile={setInputFile} />
              <div className="text">{`Input: ${inputFilePath}`}</div>
              <MultiImportButton setInputList={setInputList} />
              <div className="text">{inputListMap}</div>
              <Box sx={{height:400, bgcolor:'#4c4c4c'}}>filepath list</Box>
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
            <SelectCodecOption onCodecOptionChange={setCodecOption} videoCodec={encodeOptions.videoCodec} codecOption={encodeOptions.codecOption}/>
            {encodeOptions.codecOption[0]}
            <br />
            <SelectContainerFormat onContainerFormatChange={setContainerFormat} videoCodec={encodeOptions.videoCodec} />
            {encodeOptions.containerFormat}
            <br />
            <OutputButton onOutputFolderChange={setOutputFolder} />
            <div className='text'>{encodeOptions.outputFolder}</div>
            <EncodeButton />
            <p id="checkFilePath" />
            <p id="ffmpegLog" />
            </Stack>
          </Grid2>
        </Grid2>
      </div>
    </div>
  )
}

export default App
