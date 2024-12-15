import React, { useEffect } from 'react'
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
import { Box, Button, Grid2, Stack } from '@mui/material'
import FFmpegLogDisplay from './components/FfmpegLogDisplay'


function App(): JSX.Element {

  const [inputFileList, setInputList] = React.useState<string[]>([])

  const {
    encodeOptions,
    setVideoCodec,
    setCodecOption,
    setContainerFormat,
    setSuffix,
    setOutputFolder
  } = useEncodeOptions();

  const useMultiKey = (triggerValue: string) => {
    //初期値をユニークに指定しないとインクリメントしてもkeyが被る
    const [keys, setKeys] = React.useState<number[]>([0,1,2,3]);
    useEffect(() => {
      setKeys(prevKeys => prevKeys.map(key => key + 1));
    }, [triggerValue]);
    return keys;
  }

  const [inputFileKey, codecOptionKey, containerFormatKey, suffixKey] = useMultiKey(encodeOptions.videoCodec)


  return (
    <><Stack spacing={1}>
      <Grid2 container spacing={2}>
        <Grid2 size={8}>
          <Stack spacing={1}>
            <Grid2 container spacing={2}>
              <Grid2 size={"auto"}>
                <MultiImportButton key={inputFileKey} inputFileList={inputFileList} setInputList={setInputList} />
              </Grid2>
              <Grid2 size={"grow"}><Box></Box></Grid2>
              <Grid2 size={"auto"}>
                <Button variant="outlined" color="warning" onClick={() => setInputList([])}>Reset File Select</Button>
              </Grid2>
            </Grid2>
            <InputListDisplay inputFileList={inputFileList} setInputList={setInputList} />
          </Stack>
        </Grid2>
        <Grid2 size={4}>
          <Stack spacing={1}>
          <SelectVideoCodec onVideoCodecChange={setVideoCodec} videoCodec={encodeOptions.videoCodec} />
          <SelectCodecOption key={codecOptionKey} onCodecOptionChange={setCodecOption} videoCodec={encodeOptions.videoCodec} />
          <SelectContainerFormat key={containerFormatKey} onContainerFormatChange={setContainerFormat} videoCodec={encodeOptions.videoCodec} />
          <SelectSuffix key={suffixKey} onSuffixChange={setSuffix} suffix={encodeOptions.suffix} videoCodec={encodeOptions.videoCodec} />
          <OutputButton onOutputFolderChange={setOutputFolder} />
          <OptionDisplay encodeOptions={encodeOptions} />
          <EncodeButton encodeOptions={encodeOptions} inputFileList={inputFileList}/>
          </Stack>
        </Grid2>
      </Grid2>
      <FFmpegLogDisplay />
      </Stack>
    </>
  )
}

export default App
