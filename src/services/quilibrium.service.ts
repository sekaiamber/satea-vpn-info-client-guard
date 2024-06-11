import { DatabaseNamespace } from '@satea/vpn-info-monitor-utils/lib/Database/index'
import {
  KuzcoAPIWorkerListResponse,
  KuzcoAPIWorkerListData,
} from '@satea/vpn-info-monitor-utils/lib/kuzco'
import getUtils from '../utils/sateavpn'
import { QuilibriumNodeInfotData } from '@satea/vpn-info-monitor-utils/lib/quilibrium'

const namespace = 'quilibrium_service'

interface QuilibriumPM2Client {
  pmExecPath: string
  pmCwd: string
  user: string
  raw: any
}

const filenameReg = /node-(\d+\.\d+\.\d+)-(darwin|linux)-(arm64|amd64)/i

export async function getQuilibriumClient(): Promise<QuilibriumPM2Client | null> {
  const utils = getUtils()
  const result = await utils.shellScripts.scriptRunner.exec('pm2 jlist')

  if (!result.success) {
    console.log('pm2 jlist failed')
    return null
  }
  try {
    const pm2processes = JSON.parse(result.stdout.trim())
    const client = pm2processes.find((p: any) => p.name === 'ceremonyclient')
    if (!client) {
      return null
    }
    if (client.pm2_env.status !== 'online') return null
    // /Users/ada1/ceremonyclient/node/node-1.4.19-darwin-arm64
    const path = client.pm2_env.pm_exec_path as string
    const filename = path.substring(path.lastIndexOf('/') + 1)
    if (!path) return null

    if (!filenameReg.test(filename)) return null
    const ret: QuilibriumPM2Client = {
      pmExecPath: path,
      pmCwd: client.pm2_env.pm_cwd,
      user: client.pm2_env.USER,
      raw: client,
    }

    return ret
  } catch (error) {
    console.log('pm2 jlist parse failed: ', (error as Error).message)
  }
  return null
}

export async function getQuilibriumNodeInfo(
  client: QuilibriumPM2Client
): Promise<QuilibriumNodeInfotData> {
  // cd ~/ceremonyclient/node && ~/ceremonyclient/node/node-1.4.19-darwin-arm64 -node-info
  const cmd = `cd ${client.pmCwd} && ${client.pmExecPath} -node-info`
  const utils = getUtils()
  const result = await utils.shellScripts.scriptRunner.exec(cmd)
  if (!result.success) {
    throw new Error('get node info failed: run cmd failed')
  }
  console.log(result)
}

const QuilibriumService = {
  getQuilibriumClient,
  getQuilibriumNodeInfo,
}

export default QuilibriumService
