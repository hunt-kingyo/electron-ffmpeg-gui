import React from 'react'
import ImportButton from './components/ImportButton'
import MultiImportButton from './components/MultiImportButton'
import SelectVideoCodec from './components/SelectVideoCodec'
import SelectCodecOption from './components/SelectCodecOption'
import SelectContainerFormat from './components/SelectContainerFormat'
import EncodeButton from './components/EncodeButton'
import OutputButton from './components/OutputButton'
import { useEncodeOptions } from './components/useEncodeOptions'

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
        <ImportButton setInputFile={setInputFile} />
        <div className="text">{`Input: ${inputFilePath}`}</div>
        <MultiImportButton setInputList={setInputList} />
        <div className="text">{inputListMap}</div>
        <SelectVideoCodec onVideoCodecChange={setVideoCodec} />
        {encodeOptions.videoCodec}
        <br />
        <select id="suffixSelect">
          <option value="">(none)</option>
          <option value="_codec">_codec</option>
          <option value="_bitrate">_bitrate</option>
          <option value="_converted">_converted</option>
          <option value="_FFmpegGUI">_FFmpegGUI</option>
        </select>
        <SelectCodecOption onCodecOptionChange={setCodecOption}/>
        <br />
        <SelectContainerFormat onContainerFormatChange={setContainerFormat} />
        {encodeOptions.containerFormat}
        <OutputButton onOutputFolderChange={setOutputFolder} />
        <div className='text'>{encodeOptions.outputFolder}</div>
      </div>
      <EncodeButton />
      <p id="checkFilePath" />
      <p id="ffmpegLog" />

    </div>
  )
}

export default App
