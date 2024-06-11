import APP from '.'
import Decimal from 'decimal.js-light'
import {
  PingpongController,
  UtilsController,
  KuzcoController,
} from './controllers'
import { PORT } from './constants'

Decimal.set({ toExpPos: 999, toExpNeg: -999, precision: 64 })

const app = new APP({
  port: PORT ? parseInt(PORT) : undefined,
  controllers: [
    new PingpongController(),
    new UtilsController(),
    new KuzcoController(),
  ],
})

app
  .init()
  .then(async () => {
    await app.listen()
  })
  .then(() => {
    console.log('server inited')
  })
  .catch(async (e) => {
    console.log(e)
    return await app.destory()
  })
  .catch((e) => {
    console.log(e)
  })
