import React from 'react'
import ImportButton from './components/ImportButton'
import MultiImportButton from './components/MultiImportButton'
import CodecSelectMUI from './components/CodecSelectMUI'
import OptionSelect from './components/OptionSelect'
import SelectFormat from './components/SelectFormat'
import EncodeButton from './components/EncodeButton'
import OutputButton from './components/OutputButton'
import { useEncodeOptions } from './useEncodeOptions'

function App(): JSX.Element {

  const [inputFilePath, setInputFile] = React.useState<string>('')
  const [inputFileList, setInputList] = React.useState<string[]>([])
  const [selectedCodec, setCodec] = React.useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedOption, setOption] = React.useState<string[]>([])
  const [selectedFormat, setFormat] = React.useState<string>('')
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
        <CodecSelectMUI setCodec={setCodec} selectedCodec={''} setOption={setOption} setFormat={setFormat} />
        <br />
        <select id="suffixSelect">
          <option value="">(none)</option>
          <option value="_codec">_codec</option>
          <option value="_bitrate">_bitrate</option>
          <option value="_converted">_converted</option>
          <option value="_FFmpegGUI">_FFmpegGUI</option>
        </select>
        <OptionSelect selectedCodec={selectedCodec} setOption={setOption} selectedOption={[]}/>
        <br />
        <SelectFormat selectedCodec={selectedCodec} setFormat={setFormat} />
        {selectedFormat}
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
