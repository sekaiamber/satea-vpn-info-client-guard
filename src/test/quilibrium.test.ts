import QuilibriumService from '../services/quilibrium.service'

async function task(): Promise<void> {
  const client = await QuilibriumService.getQuilibriumClient()
  console.log(client)
}

task().catch((e) => console.log(e))
