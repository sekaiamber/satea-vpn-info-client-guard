import { DatabaseNamespace } from '@satea/vpn-info-monitor-utils/lib/Database/index'
import {
  KuzcoAPIWorkerListResponse,
  KuzcoAPIWorkerListData,
} from '@satea/vpn-info-monitor-utils/lib/kuzco'
import getUtils from '../utils/sateavpn'
import axios from 'axios'

const namespace = 'quilibrium_service'

export async function getQuilibriumClient(): Promise<boolean> {
  const utils = getUtils()
  const result = await utils.shellScripts.scriptRunner.exec('pm2 jlist')
  console.log(result)
  return true
}

const QuilibriumService = {
  getQuilibriumClient,
}

export default QuilibriumService
