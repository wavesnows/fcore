import IEvent from './IEvent'
import DispatcherBase from './DispatcherBase'
import IEventHandler from './IEventHandler'
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 */

export default class EventDispatcher<TSender, TArgs>
    extends DispatcherBase<IEventHandler<TSender, TArgs>>
    implements IEvent<TSender, TArgs> {
    /**
     * Creates a new EventDispatcher instance.
     */
    constructor() {
        super()
    }

    /**
     * Dispatches the event.
     * @param sender The sender.
     * @param args The arguments object.
     */
    public dispatch(sender: TSender, args: TArgs): void {
        console.log(sender, args)
        this._dispatch(false, this, arguments)
    }

    /**
     * Dispatches the events thread.
     * @param sender The sender.
     * @param args The arguments object.
     */
    public dispatchAsync(sender: TSender, args: TArgs): void {
        console.log(sender, args)
        this._dispatch(true, this, arguments)
    }

    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    public asEvent(): IEvent<TSender, TArgs> {
        return super.asEvent()
    }
}
