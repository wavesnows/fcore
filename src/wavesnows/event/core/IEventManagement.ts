/**
 * Manages the event.
 *
 * @export
 * @interface IEventManagement
 */
interface IEventManagement {
    /**
     * Will unsubscribe the handler.
     *
     * @memberof IEventManagement
     */
    unsub(): void;
  
    /**
     * Stops the propagation of the event.
     * Cannot be used when async dispatch is done.
     *
     * @memberof IEventManagement
     */
    stopPropagation(): void;
  }

  export default IEventManagement
  