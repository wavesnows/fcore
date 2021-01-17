import Oper from './Oper'
import OperEvent from '../event/OperEvent'
import IEventManagement from '../event/core/IEventManagement'

/**
 * @description Queue
 * Use defaultQueue will create defult queue.
 * @author wavesnow
 * @since 2020.01.01
 */
export default class Queue extends Oper {
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

    static get defaultQueue(): Queue {
        if (!Queue._defaultQueue) Queue._defaultQueue = new Queue()
        return Queue._defaultQueue
    }

    /**
     * Commit to Queue
     *
     */

    commitChild(obj: Oper): void {
        obj.queue = undefined
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
                //console.log(s, type)
                if (
                    type.type == OperEvent.CHILD_OPERATION_COMPLETE ||
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
            if (
                type.type == OperEvent.CHILD_OPERATION_COMPLETE ||
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

    /*
    commit(queue?: Queue): void {
       // super.commit(queue)
       if (!queue) this.queue = Queue.defaultQueue
       if (queue != this) super.commit(queue)
    }
    */

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
