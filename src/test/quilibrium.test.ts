import QuilibriumService from '../services/quilibrium.service'

async function task(): Promise<void> {
  const client = await QuilibriumService.getQuilibriumClient()
  if (!client) return
  const nodeInfo = await QuilibriumService.getQuilibriumNodeInfo(client)
  console.log(nodeInfo)
}

task().catch((e) => console.log(e))
