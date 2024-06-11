import { SateaVPNUtils } from '@satea/vpn-info-monitor-utils'
import {
  SATEA_PATH,
  SATEA_MANAGER_URL,
  SATEA_MANAGER_APIKEY,
} from '../constants'

let satea: SateaVPNUtils

export default function getUtils(): SateaVPNUtils {
  if (!satea) {
    satea = new SateaVPNUtils({
      path: SATEA_PATH,
      managerUrl: SATEA_MANAGER_URL,
      managerAPIKey: SATEA_MANAGER_APIKEY,
    })
  }
  return satea
}
