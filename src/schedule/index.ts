import Schedule from './Schedule'
import TestTask from './TestTask'
import { KuzcoClientInfoTask } from './Kuzco'
import { QuilibriumNodeInfoTask } from './Quilibrium'

export default class WrappedSchedule extends Schedule {
  constructor() {
    super([new KuzcoClientInfoTask(), new QuilibriumNodeInfoTask()])
  }
}
