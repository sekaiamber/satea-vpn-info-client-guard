import Schedule from './Schedule'
import TestTask from './TestTask'
import { KuzcoWorkerListTask } from './Kuzco'

export default class WrappedSchedule extends Schedule {
  constructor() {
    super([new KuzcoWorkerListTask()])
  }
}
