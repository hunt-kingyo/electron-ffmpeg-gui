import React from 'react'
import ImportButton from './components/ImportButton'
import MultiImportButton from './components/MultiImportButton'
import CodecSelectMUI from './components/CodecSelectMUI'
import OptionSelect from './components/OptionSelect'

function App(): JSX.Element {

  const [inputFilePath, setInputFile] = React.useState<string>('')
  const [inputFileList, setInputList] = React.useState<string[]>([])
  const [selectedCodec, setCodec] = React.useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedOption, setOption] = React.useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  const [_selectedFormat, setFormat] = React.useState<string>('')
  const inputListMap = inputFileList.map((filePath) => <li key={filePath}>{filePath}</li>)

  return (
    <div>
      <div className="actions">
        <ImportButton setInputFile={setInputFile} />
        <div className="text">{`Input: ${inputFilePath}`}</div>
        <MultiImportButton setInputList={setInputList} />
        <div className="text">{inputListMap}</div>
        <CodecSelectMUI setCodec={setCodec} selectedCodec={''} setOption={setOption} />
        <br />
        <select id="suffixSelect">
          <option value="">(none)</option>
          <option value="_codec">_codec</option>
          <option value="_bitrate">_bitrate</option>
          <option value="_converted">_converted</option>
          <option value="_FFmpegGUI">_FFmpegGUI</option>
        </select>
        <OptionSelect selectedCodec={selectedCodec} setOption={setOption} selectedOption={[]}/>
        {/*<SelectFormat selectedCodec={selectedCodec} setFormat={setFormat} selectedFormat={''}/>*/}
        <br />
        <button className="action" >
          <a>Select output folder</a>
        </button>
        <p id="outputFolder" />
      </div>
      <div className="actions">
        <button className="action" id="encodeButton">
          <a>Encode</a>
        </button>
        <p id="checkFilePath" />
        <p id="ffmpegLog" />
      </div>
    </div>
  )
}

export default App
