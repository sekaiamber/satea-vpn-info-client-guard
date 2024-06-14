import { timeNumber } from '../../utils/time'
import BaseTask, { ReportRequestRawData, TaskRunningStatus } from '../BaseTask'
import QuilibriumService from '../../services/quilibrium.service'
import { QuilibriumNodeInfotData } from '@satea/vpn-info-monitor-utils/lib/quilibrium'
import getUtils from '../../utils/sateavpn'

export default class QuilibriumNodeInfoTask extends BaseTask<QuilibriumNodeInfotData> {
  public readonly namespace = 'quil_node_info'
  public readonly cronExpression = '*/5 * * * *'
  public readonly timeout = timeNumber.second * 30

  protected async parseResult(
    status: TaskRunningStatus<QuilibriumNodeInfotData>
  ): Promise<ReportRequestRawData<QuilibriumNodeInfotData>> {
    const satea = getUtils()
    const name = await satea.shellScripts.whoami()
    if (status.success) {
      return {
        topic: this.namespace,
        indexes: [name, status.taskId],
        processTime: status.processTime,
        status: 'normal',
        rawData: status.result,
      }
    }
    return {
      topic: this.namespace,
      indexes: [name, status.taskId],
      processTime: status.processTime,
      status: 'error',
      error: status.error?.message,
    }
  }

  protected async onProcess(): Promise<QuilibriumNodeInfotData | null> {
    const client = await QuilibriumService.getQuilibriumClient()
    if (!client) return null
    const info = await QuilibriumService.getQuilibriumNodeInfo(client)
    return info
  }
}
