import { DatabaseNamespace } from '@satea/vpn-info-monitor-utils/lib/Database/index'
import {
  KuzcoAPIWorkerListResponse,
  KuzcoAPIWorkerListData,
} from '@satea/vpn-info-monitor-utils/lib/kuzco'
import getUtils from '../utils/sateavpn'
import axios from 'axios'

const namespace = 'kuzco_service'

export interface KuzcoServiceData {
  jwt?: string
}

async function getDbNamepace(
  utils = getUtils()
): Promise<DatabaseNamespace<KuzcoServiceData>> {
  return await utils.db.namespace(namespace, {})
}

export async function writeJWTToken(jwt: string): Promise<void> {
  const utils = getUtils()
  const ns = await getDbNamepace(utils)
  await ns.setConstant('jwt', jwt)
}

export async function readJWTToken(): Promise<string | undefined> {
  const utils = getUtils()
  const ns = await getDbNamepace(utils)
  return await ns.getConstant('jwt')
}

export async function getWorkerList(): Promise<KuzcoAPIWorkerListData> {
  const jwt = await readJWTToken()
  if (!jwt) {
    throw new Error('jwt not provided')
  }
  const resp = await axios.get<KuzcoAPIWorkerListResponse>(
    'https://relay.kuzco.xyz/api/trpc/worker.list?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D',
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${jwt}`,
        'Sec-Fetch-Site': 'cross-site',
        'Accept-Encoding': 'gzip',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Sec-Fetch-Mode': 'cors',
        Host: 'relay.kuzco.xyz',
        Origin: 'tauri://localhost',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
      },
    }
  )
  // console.log(resp.data[0].result.data.json)
  if (resp.data[0] && resp.data[0].result?.data?.json?.status === '200') {
    return resp.data[0].result.data.json.workers
  }
  // TODO: get error message
  throw new Error('fetch failed')
}

const KuzcoService = {
  writeJWTToken,
  readJWTToken,
  getWorkerList,
}

export default KuzcoService
