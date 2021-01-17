import Oper from './Oper'
/**
 * Timeout Function
 *
 * @author
 *
 */
export default class DelayOper extends Oper {
    constructor(timeout: number = 0) {
        super()
        this.timeout = timeout
    }
    /**
     * Delay Time, millisecond, nagative is always waiting
     */
    public timeout: number = 0

    private timeId?: number

    /** @inheritDoc*/
    public execute(): void {
        super.execute()
        if (this.timeout < 0) return

        this.timeId = window.setTimeout(this.result.bind(this), this.timeout)
    }

    /** @inheritDoc*/
    end(event?: any): void {
        if (this.timeId) {
            clearTimeout(this.timeId)
        }
        super.end(event)
    }
}
