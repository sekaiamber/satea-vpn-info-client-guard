import { sleep } from '../utils'
import BaseTask from './BaseTask'

export default class Schedule {
  constructor(private readonly tasks: BaseTask[]) {}

  async init(): Promise<void> {
    for (const task of this.tasks) {
      await task.init()
    }
  }

  async start(): Promise<void> {
    for (const task of this.tasks) {
      await task.start()
    }
  }

  async destory(): Promise<void> {
    for (const task of this.tasks) {
      await task.destory()
    }
  }
}
