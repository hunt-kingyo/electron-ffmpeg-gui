export class FfmpegJobManager {
  private activeJob?: { controller: AbortController; done: Promise<unknown> }

  get isRunning(): boolean {
    return this.activeJob !== undefined
  }

  async run<T>(task: (signal: AbortSignal) => Promise<T>): Promise<T> {
    if (this.activeJob) throw new Error('An encoding job is already running.')

    const controller = new AbortController()
    const done = Promise.resolve()
      .then(() => task(controller.signal))
      .finally(() => {
        this.activeJob = undefined
      })
    this.activeJob = { controller, done }
    return done
  }

  async stop(): Promise<void> {
    const job = this.activeJob
    if (!job) return

    job.controller.abort()
    // Keep the job locked until its child process has actually closed.
    await job.done.catch(() => undefined)
  }
}
