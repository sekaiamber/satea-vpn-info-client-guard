import { sleep } from '../utils'
import { timeNumber } from '../utils/time'
import BaseTask from './BaseTask'

export default class TestTask extends BaseTask<number> {
  public readonly namespace = 'test'
  public readonly cronExpression = '* * * * * *'
  public readonly timeout = timeNumber.second * 2

  protected async onProcess(): Promise<number> {
    await sleep(5000)
    return new Date().getTime()
  }
}
