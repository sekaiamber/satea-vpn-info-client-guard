import Schedule from './Schedule'
import TestTask from './TestTask'
import { KuzcoWorkerListTask } from './Kuzco'
import { QuilibriumNodeInfoTask } from './Quilibrium'

export default class WrappedSchedule extends Schedule {
  constructor() {
    super([new KuzcoWorkerListTask(), new QuilibriumNodeInfoTask()])
  }
}
