import IBaseEventHandling from './IBaseEventHandling'
import IEventHandler from './IEventHandler'
/**
 * Indicates the object is capable of handling named events.
 */
export interface IEventHandling<TSender, TArgs>
    extends IBaseEventHandling<IEventHandler<TSender, TArgs>> {}
export default IEventHandling
