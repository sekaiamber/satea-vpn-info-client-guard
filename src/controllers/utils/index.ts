import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  Router,
} from 'express'
import { Controller } from '../types'

export default class UtilsController implements Controller {
  public path = '/api/v1/utils'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/ip', this.ip as RequestHandler)
  }

  private ip(request: Request, response: Response, next: NextFunction): void {
    const ip =
      request.headers['x-forwarded-for'] ?? request.socket.remoteAddress ?? ''
    if (ip) {
      response.status(200).send(ip)
    } else {
      response.status(500).send(ip)
    }
  }
}
