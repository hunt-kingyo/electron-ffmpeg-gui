import React from 'react'
import ImportButton from './components/ImportButton'
import MultiImportButton from './components/MultiImportButton'

function App(): JSX.Element {
  const [inputFilePath, setInputFile] = React.useState<string>('')
  const [inputFileList, setInputList] = React.useState<string[]>([])
  const inputListMap = inputFileList.map((filePath) => <li key={filePath}>{filePath}</li>)

  return (
    <div>
      <div className="actions">
        <ImportButton setInputFile={setInputFile} />
        <div className="text">{`Input: ${inputFilePath}`}</div>
        <MultiImportButton setInputList={setInputList} />
        <div className="text">{inputListMap}</div>
        <select id="codecSelect">
          <option value="">--Select codec--</option>
          <option value="h264_nvenc">NVIDIA NVENC H.264</option>
          <option value="hevc_nvenc">NVIDIA NVENC H.265</option>
          <option value="av1_nvenc">NVIDIA NVENC av1</option>
          <option value="libx264">H.264</option>
          <option value="libx265">H.265</option>
          <option value="ilbvpx-vp9">libvpx VP9</option>
          <option value="libaom-av1">libaom AV1</option>
          <option value="dnxhd">DNxHR</option>
          <option value="cfhd">GoPro CineForm HD</option>
          <option value="prores_ks">Apple ProRes(iCodec Pro)</option>
        </select>
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
