import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const button = (): void => window.myAPI.openDialog()
  const multiImportButton = (): void => window.myAPI.mpenMultipleDialog()

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action" id="button">
          <a onClick={button}>Select file</a>
        </div>
        <p id="text" />
        <div className="action" id="multiImportButton">
          <a>Select multiple files</a>
        </div>
        <p id="inputList" />
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
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>

      <Versions></Versions>
    </>
  )
}

export default App
