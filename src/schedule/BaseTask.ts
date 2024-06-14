import cron from 'node-cron'
import { sleep } from '../utils'
import { ReportRequestData } from '@satea/vpn-info-monitor-utils/lib/Manager'
import getUtils from '../utils/sateavpn'

export interface TaskRunningStatus<T> {
  processTime: number
  success: boolean
  result?: T
  error?: Error
  skipped?: boolean
  taskId: string
}

export type ReportRequestRawData<T> = Omit<ReportRequestData<T>, 'clientUUID'>

export default class BaseTask<T = any> {
  public readonly namespace!: string
  public readonly cronExpression!: string
  public readonly timeout!: number
  protected readonly needReport = true
  private task?: cron.ScheduledTask

  private async wrapTimeout(): Promise<T> {
    await sleep(this.timeout)
    throw new Error('task timed out')
  }

  async init(): Promise<void> {
    if (this.task) return
    this.task = cron.schedule(
      this.cronExpression,
      () => {
        const start = Date.now()
        // TODO: finish before process exit
        Promise.race([this.onProcess(), this.wrapTimeout()])
          .then(async (result) => {
            if (result === null) return
            const end = Date.now()
            await this.onAfterProcess({
              result,
              processTime: end - start,
              success: true,
              taskId: start.toString(),
            })
          })
          .catch(async (error) => {
            const end = Date.now()
            await this.onAfterProcess({
              error,
              processTime: end - start,
              success: true,
              taskId: start.toString(),
            })
          })
      },
      {
        scheduled: false,
      }
    )
  }

  async start(): Promise<void> {
    if (!this.task) {
      throw new Error('task not inited')
    }
    this.task.start()
  }

  async destory(): Promise<void> {
    if (!this.task) return
    this.task.stop()
  }

  protected async onProcess(): Promise<T | null> {
    throw new Error('not implemented')
  }

  protected async parseResult(
    status: TaskRunningStatus<T>
  ): Promise<ReportRequestRawData<T>> {
    throw new Error('not implemented')
  }

  protected async onReport(data: ReportRequestRawData<T>): Promise<void> {
    const satea = getUtils()
    try {
      await satea.manager.clientReport(data as any)
    } catch (error) {
      console.error(error)
    }
  }

  protected async onAfterProcess(status: TaskRunningStatus<T>): Promise<void> {
    if (this.needReport) {
      const data = await this.parseResult(status)
      await this.onReport(data)
    }
  }
}
