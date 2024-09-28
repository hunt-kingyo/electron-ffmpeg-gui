import React from 'react'
import ImportButton from './components/ImportButton'
import MultiImportButton from './components/MultiImportButton'
import CodecSelect from './components/CodecSelect'

function App(): JSX.Element {
  const [inputFilePath, setInputFile] = React.useState<string>('')
  const [inputFileList, setInputList] = React.useState<string[]>([])
  const [selectedCodec, setCodec] = React.useState<string>('')
  const inputListMap = inputFileList.map((filePath) => <li key={filePath}>{filePath}</li>)

  return (
    <div>
      <div className="actions">
        <ImportButton setInputFile={setInputFile} />
        <div className="text">{`Input: ${inputFilePath}`}</div>
        <MultiImportButton setInputList={setInputList} />
        <div className="text">{inputListMap}</div>
        <CodecSelect setCodec={setCodec} selectedCodec={''} />
        <br />
        <select id="suffixSelect">
          <option value="">(none)</option>
          <option value="_codec">_codec</option>
          <option value="_bitrate">_bitrate</option>
          <option value="_converted">_converted</option>
          <option value="_FFmpegGUI">_FFmpegGUI</option>
        </select>
        <br />
        <div className="action" id="outputButton">
          <a>Select output folder</a>
        </div>
        <p id="outputFolder" />
      </div>
      <div className="actions">
        <div className="action" id="encodeButton">
          <a>Encode</a>
        </div>
        <p id="checkFilePath" />
        <p id="ffmpegLog" />
      </div>
    </div>
  )
}

export default App
