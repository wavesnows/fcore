import IOper from './IOper'
import EventDispatcher from '../event/core/EventDispatcher'
import OperEvent from '../event/OperEvent'
import IEventManagement from '../event/core/IEventManagement'

/**
 * @description Oper
 * @author xxx
 * @since 2020.01.01
 */

export default abstract class Oper extends EventDispatcher<Oper, OperEvent>
    implements IOper {
    static NONE: number = 0
    static WAIT: number = 1
    static RUN: number = 2
    static END: number = 3

    constructor() {
        super()
    }

    /**
     * ID
     */
    public id: string = ''

    /**
     * Current Queue
     */

    public queue: Queue | undefined

    /**
     * Current Step
     */

    public step: number = Oper.NONE

    /**
     * Last Result
     */
    public lastResult: any

    /**
     * Immediately
     *
     * Don't wait  wait, run next Oper immediately.
     */
    public immediately: boolean = false

    /**
     * Countinue when fail
     */
    public continueWhenFail: boolean = true

    /**
     * Execute right now
     *
     */

    execute(): void {
        var event: OperEvent = new OperEvent(OperEvent.OPERATION_START, this)
        this.dispatch(this, event)
        if (this.queue) {
            // this.queue
            // queue dispatch or this dispatch
            this.queue.dispatch(
                this,
                new OperEvent(OperEvent.CHILD_OPERATION_START, this.queue, this)
            )
        }

        this.step = Oper.RUN

        if (this.immediately) {
            event = new OperEvent(OperEvent.OPERATION_COMPLETE, this)
            this.dispatch(this, event)

            if (this.queue) {
                this.dispatch(
                    this,
                    new OperEvent(
                        OperEvent.CHILD_OPERATION_COMPLETE,
                        this.queue,
                        this
                    )
                )
            }
        }
    }
    /**
     * Succeed Function
     *
     */

    result(result?: any): void {
        this.lastResult = result

        this.end(result)
        var event: OperEvent = new OperEvent(OperEvent.OPERATION_COMPLETE, this)
        event.result = result
        this.dispatch(this, event)

        if (this.queue) {
            event = new OperEvent(
                OperEvent.CHILD_OPERATION_COMPLETE,
                this.queue,
                this
            )
            event.result = result
            this.dispatch(this, event)

            this.queue = undefined
        }

        this.step = Oper.END
    }

    /**
     * Fault Function
     *
     */

    fault(result?: any): void {
        this.lastResult = result
        this.end(result)

        var event: OperEvent = new OperEvent(OperEvent.OPERATION_ERROR, this)
        event.result = result
        this.dispatch(this, event)

        if (this.queue) {
            event = new OperEvent(
                OperEvent.CHILD_OPERATION_ERROR,
                this.queue,
                this
            )
            event.result = result
            this.dispatch(this, event)

            this.queue = undefined
        }

        this.step = Oper.END
    }

    /**
     * Push to queue
     *
     * @param queue	used queue, if null, use the default one.
     *
     */
    commit(queue?: Queue): void {
        if (!this.queue) this.queue = Queue.defaultQueue
        console.log(queue)

        this.queue.commitChild(this)
    }

    /**
     * End function
     * @param event
     *
     */
    end(event?: any): void {
      console.log(event)

    }

    /**
     * Halt queue
     *
     */
    halt(): void {
        this.end()
        if (this.queue) this.queue.haltChild(this)
    }
}

/**
 * @description Queue
 * Use defaultQueue will create defult queue.
 * @author wavesnow
 * @since 2020.01.01
 */
export class Queue extends Oper {
    private static _defaultQueue: Queue

    /**
     * Sub Oper Array
     */
    public children: Array<Oper> = []

    constructor(children?: Array<Oper>) {
        super()
        if (!children) children = []
        this.children = children
    }

    /**
     * Default Queue
     */

    public static get defaultQueue(): Queue {
        if (!Queue._defaultQueue) Queue._defaultQueue = new Queue()
        return Queue._defaultQueue
    }

    /**
     * Commit to Queue
     *
     */

    commitChild(obj: Oper): void {
        obj.queue = this
        obj.step = Oper.WAIT
        this.children.push(obj)
        if (this.children.length == 1) this.doLoad()
    }

    /**
     * Move out of Queue
     *
     */
    haltChild(obj: Oper): void {
        obj.queue = undefined
        obj.step = Oper.NONE

        var index: number = this.children.indexOf(obj)
        if (index == -1) return

        if (index == 0) this.nexthandler()
        else this.children.splice(index, 1)
    }

    private doLoad(): void {
        if (this.children.length > 0) {
            var oper: Oper = this.children[0]
            oper.subscribe((s: Oper, type: OperEvent, ev: IEventManagement) => {
                console.log(s, type, ev)
                if (
                    type.type == OperEvent.OPERATION_COMPLETE ||
                    type.type == OperEvent.OPERATION_ERROR
                ) {
                    this.nexthandler()
                }
            }).bind(this)
            oper.execute()
        } else {
            this.result()
        }
    }

    private nexthandler(event?: OperEvent | undefined): void {
        var oper: Oper = this.children[0]
        oper.unsubscribe((s: Oper, type: OperEvent, ev: IEventManagement) => {
            console.log(s)
            if (
                type.type == OperEvent.OPERATION_COMPLETE ||
                type.type == OperEvent.OPERATION_ERROR
            ) {
                ev.unsub()
            }
        })

        this.children.shift()

        if (
            oper.continueWhenFail ||
            (event && event.type == OperEvent.OPERATION_COMPLETE)
        )
            this.doLoad()
    }

    commit(queue?: Queue): void {
        if (!queue) this.queue = Queue.defaultQueue
        if (queue != this) super.commit(queue)
    }

    execute(): void {
        super.execute()
        this.doLoad()
    }

    halt(): void {
        super.halt()

        if (this.children.length > 0) {
            this.children = this.children.slice(0, 1)
            this.children[0].halt()
        }
    }
}
