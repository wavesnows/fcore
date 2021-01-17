import IEventManagement from './IEventManagement';
/**
 * Interface for event handlers.
 *
 * @export
 * @interface IEventHandler
 * @template TSender The sender type.
 * @template TArgs The arguments type.
 */
interface IEventHandler<TSender, TArgs> {
    (sender: TSender, args: TArgs, ev: IEventManagement): void;
  }

export default  IEventHandler