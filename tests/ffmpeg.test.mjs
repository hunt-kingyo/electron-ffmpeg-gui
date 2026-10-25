import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { execFileSync, spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { PassThrough } from 'node:stream'
import { setImmediate } from 'node:timers/promises'
import test from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)

// Load the actual main-process sources without launching Electron or writing build files.
function sourceLoader(overrides = {}) {
  const cache = new Map()
  function load(file) {
    file = resolve(file)
    if (cache.has(file)) return cache.get(file).exports
    const module = { exports: {} }
    cache.set(file, module)
    const code = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true }
    }).outputText
    const localRequire = (name) => {
      if (Object.hasOwn(overrides, name)) return overrides[name]
      return name.startsWith('.') ? load(resolve(dirname(file), `${name}.ts`)) : require(name)
    }
    new Function('require', 'module', 'exports', '__dirname', code)(
      localRequire,
      module,
      module.exports,
      dirname(file)
    )
    return module.exports
  }
  return load
}

function childProcess() {
  const child = new EventEmitter()
  child.stdin = new PassThrough()
  child.stderr = new PassThrough()
  child.exitCode = null
  child.signalCode = null
  child.kills = []
  child.kill = (signal) => {
    child.kills.push(signal)
    return true
  }
  return child
}

const options = {
  ffmpegPath: '/ffmpeg',
  inputFilePath: '/input.mp4',
  outputFilePath: '/output.mp4',
  videoCodec: 'libx264',
  codecOptions: [],
  containerFormat: 'mp4',
  onLog: () => {}
}

function runner(child) {
  return sourceLoader({ child_process: { spawn: () => child } })('src/main/ffmpeg/runFfmpeg.ts')
}

test('progress survives every chunk boundary in duration and elapsed timestamps', () => {
  const { FfmpegProgressParser } = sourceLoader()('src/main/ffmpeg/parseFfmpegProgress.ts')
  const output = '  Duration: 00:01:00.50, start: 0.000000\nframe=10 time=00:00:30.25 speed=1x\r'
  const expected = { percent: 50, elapsedSeconds: 30.25, durationSeconds: 60.5 }
  for (let boundary = 1; boundary < output.length; boundary++) {
    const parser = new FfmpegProgressParser()
    const first = parser.parse(output.slice(0, boundary))
    const second = parser.parse(output.slice(boundary))
    assert.deepEqual(second ?? first, expected, `chunk boundary ${boundary}`)
  }
  const parser = new FfmpegProgressParser()
  let progress
  for (const character of output) progress = parser.parse(character) ?? progress
  assert.deepEqual(progress, expected)
})

test('progress waits for complete records and uses the latest carriage-return update', () => {
  const { FfmpegProgressParser } = sourceLoader()('src/main/ffmpeg/parseFfmpegProgress.ts')
  const parser = new FfmpegProgressParser()
  assert.equal(parser.parse('Duration: 00:01:00.'), null)
  assert.equal(parser.parse('50\r\nframe=1 time=00:00:30.'), null)
  assert.deepEqual(parser.parse('25\rframe=2 time=00:00:45.375\r'), {
    percent: 75,
    elapsedSeconds: 45.375,
    durationSeconds: 60.5
  })
})

test('progress recovers after a long diagnostic line and stays within percentage bounds', () => {
  const { FfmpegProgressParser } = sourceLoader()('src/main/ffmpeg/parseFfmpegProgress.ts')
  const parser = new FfmpegProgressParser()
  assert.equal(parser.parse('x'.repeat(100000)), null)
  assert.equal(parser.parse('\nDuration: 00:00:10.00\n'), null)
  assert.deepEqual(parser.parse('time=00:00:11.00\r'), {
    percent: 100,
    elapsedSeconds: 11,
    durationSeconds: 10
  })
})

test('file progress events survive fragmented output and suppress unchanged percentages', async () => {
  const child = childProcess()
  const progress = []
  const done = runner(child).runFfmpeg({ ...options, onProgress: (event) => progress.push(event) })
  child.stderr.write('Duration: 00:01:')
  child.stderr.write('00.00\ntime=00:00:')
  child.stderr.write('30.00\r')
  child.stderr.write('time=00:00:30.10\r')
  child.stderr.write('time=00:00:45.00\r')
  child.emit('close', 0)
  await done
  assert.deepEqual(progress, [
    {
      inputFilePath: options.inputFilePath,
      outputFilePath: options.outputFilePath,
      percent: 50,
      elapsedSeconds: 30,
      durationSeconds: 60
    },
    {
      inputFilePath: options.inputFilePath,
      outputFilePath: options.outputFilePath,
      percent: 75,
      elapsedSeconds: 45,
      durationSeconds: 60
    }
  ])
})

test('large stderr retains the final diagnostic across chunks without an unbounded error', async () => {
  const child = childProcess()
  const done = runner(child).runFfmpeg(options)
  const rejected = assert.rejects(done, (error) => {
    assert.ok(error.message.length <= 64 * 1024)
    assert.ok(error.message.endsWith('final diagnostic'))
    return true
  })
  for (let index = 0; index < 20; index++) child.stderr.write('x'.repeat(10000))
  child.stderr.write('final diag')
  child.stderr.write('nostic\n')
  child.emit('close', 1)
  await rejected
})

test('stop sends q, waits for close, and treats exit code 0 as cancelled', async () => {
  const child = childProcess()
  const { runFfmpeg, FfmpegCancelledError } = runner(child)
  const controller = new AbortController()
  const done = runFfmpeg({ ...options, signal: controller.signal })
  const rejected = assert.rejects(done, FfmpegCancelledError)
  controller.abort()
  assert.equal(child.stdin.read().toString(), 'q\n')
  let settled = false
  void done.catch(() => {
    settled = true
  })
  await setImmediate()
  assert.equal(settled, false)
  child.emit('close', 0)
  await rejected
  assert.deepEqual(child.kills, [])
})

test('a process ignoring q is killed after 3 seconds, then awaited', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const child = childProcess()
  const { runFfmpeg, FfmpegCancelledError } = runner(child)
  const controller = new AbortController()
  const done = runFfmpeg({ ...options, signal: controller.signal })
  const rejected = assert.rejects(done, FfmpegCancelledError)
  controller.abort()
  t.mock.timers.tick(2999)
  assert.deepEqual(child.kills, [])
  t.mock.timers.tick(1)
  assert.deepEqual(child.kills, ['SIGKILL'])
  child.emit('close', null)
  await rejected
})

test('a clean stop clears the forced kill timer', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const child = childProcess()
  const { runFfmpeg, FfmpegCancelledError } = runner(child)
  const controller = new AbortController()
  const rejected = assert.rejects(
    runFfmpeg({ ...options, signal: controller.signal }),
    FfmpegCancelledError
  )
  controller.abort()
  child.emit('close', 0)
  await rejected
  t.mock.timers.tick(3000)
  assert.deepEqual(child.kills, [])
})

test('an already cancelled invocation never spawns FFmpeg', async () => {
  let spawned = false
  const { runFfmpeg, FfmpegCancelledError } = sourceLoader({
    child_process: {
      spawn: () => {
        spawned = true
      }
    }
  })('src/main/ffmpeg/runFfmpeg.ts')
  await assert.rejects(runFfmpeg({ ...options, signal: AbortSignal.abort() }), FfmpegCancelledError)
  assert.equal(spawned, false)
})

test('normal completion and spawn errors still settle correctly', async () => {
  const child = childProcess()
  const { runFfmpeg } = runner(child)
  const done = runFfmpeg(options)
  child.emit('close', 0)
  await done

  const failedChild = childProcess()
  const failed = runner(failedChild).runFfmpeg(options)
  const rejected = assert.rejects(failed, /ENOENT/)
  failedChild.emit('error', new Error('ENOENT'))
  failedChild.emit('close', -2)
  await rejected
})

test('duplicate jobs are rejected until stop finishes; a new job can then start', async () => {
  const { FfmpegJobManager } = sourceLoader()('src/main/ffmpeg/FfmpegJobManager.ts')
  const jobs = new FfmpegJobManager()
  let finish
  let signal
  const first = jobs.run((jobSignal) => {
    signal = jobSignal
    return new Promise((resolve) => {
      finish = resolve
    })
  })
  await setImmediate()
  await assert.rejects(
    jobs.run(async () => {}),
    /already running/
  )
  const stopping = jobs.stop()
  const stoppingAgain = jobs.stop()
  assert.equal(signal.aborted, true)
  assert.equal(jobs.isRunning, true)
  await assert.rejects(
    jobs.run(async () => {}),
    /already running/
  )
  finish()
  await Promise.all([first, stopping, stoppingAgain])
  assert.equal(jobs.isRunning, false)
  assert.equal(await jobs.run(async () => 42), 42)
  await jobs.stop()
})

async function application() {
  const app = new EventEmitter()
  const handlers = new Map()
  const windows = []
  const children = []
  let quitCompleted = false
  app.whenReady = () => Promise.resolve()
  app.quit = () => {
    const event = {
      prevented: false,
      preventDefault() {
        this.prevented = true
      }
    }
    app.emit('before-quit', event)
    if (!event.prevented) quitCompleted = true
  }
  class Window extends EventEmitter {
    constructor() {
      super()
      this.destroyed = false
      this.messages = []
      this.webContents = {
        isDestroyed: () => this.destroyed,
        send: (channel, payload) => {
          assert.equal(this.destroyed, false)
          this.messages.push([channel, payload])
        },
        setWindowOpenHandler: () => {}
      }
      windows.push(this)
    }
    static getAllWindows() {
      return windows.filter((window) => !window.destroyed)
    }
    isDestroyed() {
      return this.destroyed
    }
    loadFile() {}
    show() {}
    close() {
      const event = {
        prevented: false,
        preventDefault() {
          this.prevented = true
        }
      }
      this.emit('close', event)
      if (!event.prevented) {
        this.destroyed = true
        this.emit('closed')
      }
    }
  }
  sourceLoader({
    electron: {
      app,
      BrowserWindow: Window,
      shell: {},
      dialog: {},
      ipcMain: {
        on: () => {},
        handle: (name, handler) => {
          assert.equal(handlers.has(name), false, `duplicate handler: ${name}`)
          handlers.set(name, handler)
        },
        removeHandler: (name) => handlers.delete(name)
      }
    },
    '@electron-toolkit/utils': {
      electronApp: { setAppUserModelId: () => {} },
      optimizer: {},
      is: { dev: false }
    },
    '../../resources/icon.png?asset': 'icon',
    'ffmpeg-static': '/ffmpeg',
    fs: { existsSync: () => false },
    child_process: {
      spawn: () => {
        const child = childProcess()
        children.push(child)
        return child
      }
    }
  })('src/main/index.ts')
  await setImmediate()
  const start = () =>
    handlers.get('start-ffmpeg')(
      {},
      {
        inputFileList: ['/first.mp4', '/second.mp4'],
        videoCodec: 'libx264',
        codecOption: [],
        containerFormat: 'mp4',
        suffix: '_converted',
        outputFolder: '/output'
      }
    )
  return { app, handlers, windows, children, start, didQuit: () => quitCompleted }
}

test('Stop cancels active and queued files without reporting all-finished', async () => {
  const { handlers, windows, children, start } = await application()
  const done = start()
  await setImmediate()
  const stopping = handlers.get('stop-ffmpeg')()
  children[0].emit('close', 0)
  const results = await done
  await stopping
  assert.equal(children.length, 1)
  assert.equal(results.length, 2)
  assert.ok(results.every((result) => result.cancelled && !result.success))
  const statuses = windows[0].messages.filter(([channel]) => channel === 'ffmpeg-status')
  assert.equal(statuses.at(-1)[1].type, 'cancelled')
  assert.ok(statuses.every(([, status]) => status.type !== 'all-finished'))
})

test('closing waits for FFmpeg, skips queued files, and permits reopening', async () => {
  const { app, handlers, windows, children, start } = await application()
  const done = start()
  await setImmediate()
  windows[0].close()
  assert.equal(windows[0].destroyed, false)
  assert.equal(children[0].stdin.read().toString(), 'q\n')
  await assert.rejects(start(), /closing/)
  children[0].emit('close', 0)
  await done
  await setImmediate()
  assert.equal(windows[0].destroyed, true)
  assert.equal(children.length, 1)
  assert.equal(handlers.size, 0)
  app.emit('activate')
  assert.equal(windows.length, 2)
  assert.equal(handlers.size, 4)
})

test('application quit uses the same stop and waits for the child to close', async () => {
  const { app, children, start, didQuit } = await application()
  const done = start()
  await setImmediate()
  app.quit()
  assert.equal(didQuit(), false)
  assert.equal(children[0].stdin.read().toString(), 'q\n')
  children[0].emit('close', 0)
  await done
  await setImmediate()
  assert.equal(children.length, 1)
  assert.equal(didQuit(), true)
})

test(
  'bundled FFmpeg exits after cancellation and retains the partial output',
  { timeout: 15000 },
  async () => {
    const folder = mkdtempSync(join(tmpdir(), 'ffmpeg-stop-test-'))
    const ffmpegPath = require('ffmpeg-static')
    const inputFilePath = join(folder, 'input.mp4')
    const outputFilePath = join(folder, 'output.mp4')
    let child
    try {
      execFileSync(
        ffmpegPath,
        [
          '-hide_banner',
          '-loglevel',
          'error',
          '-f',
          'lavfi',
          '-i',
          'testsrc2=size=320x240:rate=30',
          '-t',
          '10',
          '-c:v',
          'libx264',
          '-preset',
          'ultrafast',
          inputFilePath
        ],
        { timeout: 10000 }
      )
      const { runFfmpeg, FfmpegCancelledError } = sourceLoader({
        child_process: {
          spawn: (...args) => {
            child = spawn(...args)
            return child
          }
        }
      })('src/main/ffmpeg/runFfmpeg.ts')
      const controller = new AbortController()
      await assert.rejects(
        runFfmpeg({
          ...options,
          ffmpegPath,
          inputFilePath,
          outputFilePath,
          codecOptions: ['-preset', 'placebo'],
          signal: controller.signal,
          onProgress: () => controller.abort()
        }),
        FfmpegCancelledError
      )
      assert.ok(child.exitCode !== null || child.signalCode !== null)
      assert.ok(readFileSync(outputFilePath).length > 0)
    } finally {
      child?.kill('SIGKILL')
      rmSync(folder, { recursive: true, force: true })
    }
  }
)
