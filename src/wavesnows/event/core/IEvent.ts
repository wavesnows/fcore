import ISubscribable from './ISubscribable';
import IEventHandler from './IEventHandler';
/**
 * Models an event with a generic sender and generic argument.
 */
interface IEvent<TSender, TArgs> extends ISubscribable<IEventHandler<TSender, TArgs>> {}
export default IEvent