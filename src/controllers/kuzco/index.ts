import { Request, RequestHandler, NextFunction, Router } from 'express'
import { Controller } from '../types'
import NotFoundException from '../../exceptions/NotFoundException'
import jsonResponseMiddleware, {
  JsonResponse,
} from '../../middleware/jsonResponse.middleware'
import KuzcoService from '../../services/kuzco.service'
import jwt from 'jwt-simple'
import cors from 'cors'

const corsOptions = {
  origin: 'tauri://localhost',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

export default class PingpongController implements Controller {
  public path = '/api/v1/kuzco'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(
      '/jwt',
      cors(corsOptions),
      jsonResponseMiddleware,
      this.getJWT as RequestHandler
    )
    this.router.options('/jwt', cors(corsOptions))
    this.router.post(
      '/jwt',
      cors(corsOptions),
      jsonResponseMiddleware,
      this.setJWT as RequestHandler
    )
  }

  private getJWT(
    request: Request,
    response: JsonResponse<{ token?: string }>,
    next: NextFunction
  ): void {
    KuzcoService.readJWTToken()
      .then((token) => {
        response.jsonSuccess({ token })
      })
      .catch((e) => {
        response.status(500).jsonError(e.message, 7003)
      })
  }

  private setJWT(
    request: Request<any, any, { token: string }>,
    response: JsonResponse<{ token: string }>,
    next: NextFunction
  ): void {
    console.log(request.body)
    const { token } = request.body
    if (!token) {
      response.status(500).jsonError('token not provided', 7001)
      return
    }
    try {
      jwt.decode(token, '', true)
      KuzcoService.writeJWTToken(token)
        .then(() => {
          response.jsonSuccess({ token })
        })
        .catch((e) => {
          response.status(500).jsonError(e.message, 7002)
        })
    } catch (error) {
      response.status(500).jsonError((error as Error).message, 7002)
    }
  }
}
