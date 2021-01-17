import Oper from './Oper'
/**
 * @description TimeOutOper
 * @author xxx
 * @since 2020.01.01
 */

export default class TimeoutOper extends Oper {
    /**
     * timeout time (miliseconds)
     */
    public timeout: number = 0

    /**
     * If this value is true, will trigger result function when time up.
     */
    public alawaySuccess: boolean = false

    private timeId: number = 0

    execute(): void {
        if (this.timeout > 0) {
            if (this.alawaySuccess)
                this.timeId = window.setTimeout(
                    this.result.bind(this),
                    this.timeout
                )
            else
                this.timeId = window.setTimeout(
                    this.fault.bind(this),
                    this.timeout
                )
        }

        super.execute()
    }

    end(event: any): void {
        clearTimeout(this.timeId)
        super.end(event)
    }
}
