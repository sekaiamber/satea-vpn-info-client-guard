import { timeNumber } from '../../utils/time'
import BaseTask, { TaskRunningStatus } from '../BaseTask'
import KuzcoService from '../../services/kuzco.service'
import { KuzcoAPIWorkerListData } from '@satea/vpn-info-monitor-utils/lib/kuzco'
import { ReportRequestData } from '@satea/vpn-info-monitor-utils/lib/Manager'
import getUtils from '../../utils/sateavpn'

export default class KuzcoWorkerListTask extends BaseTask<KuzcoAPIWorkerListData> {
  public readonly namespace = 'kuzco_worker_list'
  public readonly cronExpression = '0 * * * * *'
  public readonly timeout = timeNumber.second * 30

  protected async parseResult(
    status: TaskRunningStatus<KuzcoAPIWorkerListData>
  ): Promise<ReportRequestData<KuzcoAPIWorkerListData>> {
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

  protected async onProcess(): Promise<KuzcoAPIWorkerListData | null> {
    const jwt = await KuzcoService.readJWTToken()
    if (!jwt) return null
    const list = await KuzcoService.getWorkerList()
    return list
  }
}
