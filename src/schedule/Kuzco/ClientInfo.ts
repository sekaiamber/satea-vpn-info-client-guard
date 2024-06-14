import { timeNumber } from '../../utils/time'
import BaseTask, { ReportRequestRawData, TaskRunningStatus } from '../BaseTask'
import KuzcoService from '../../services/kuzco.service'
import { KuzcoAPIAllInOneData } from '@satea/vpn-info-monitor-utils/lib/kuzco'
import getUtils from '../../utils/sateavpn'

export default class KuzcoClientInfoTask extends BaseTask<KuzcoAPIAllInOneData> {
  public readonly namespace = 'kuzco_client_info'
  public readonly cronExpression = '0 * * * * *'
  public readonly timeout = timeNumber.second * 30

  protected async parseResult(
    status: TaskRunningStatus<KuzcoAPIAllInOneData>
  ): Promise<ReportRequestRawData<KuzcoAPIAllInOneData>> {
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

  protected async onProcess(): Promise<KuzcoAPIAllInOneData | null> {
    const jwt = await KuzcoService.readJWTToken()
    if (!jwt) return null
    const list = await KuzcoService.getAllInOneData()
    return list
  }
}
