import Queue from './Oper'

interface IOper {
    /**
     * Execute right now
     *
     */

    execute(): void

    /**
     * Succeed Function
     *
     */

    result(result: any): void

    /**
     * Fault Function
     *
     */

    fault(result: any): void

    /**
     * Push to queue
     *
     * @param queue	used queue, if null, use the default one.
     *
     */
    commit(queue?: Queue): void

    /**
     * Halt queue
     *
     */
    halt(): void
}

export default IOper
