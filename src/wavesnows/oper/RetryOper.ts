import TimeoutOper from './TimeoutOper'
/**
 * Retry Oper
 *
 * @author
 *
 */
export default class RetryOper extends TimeoutOper {
    /**
     * max retry times
     */
    public maxRetry: number = 3

    /**
     * Current retry times
     */
    public retry: number = 0

    /** @inheritDoc*/
    public fault(event?: any): void {
        if (this.retry < this.maxRetry) {
            this.execute()
            this.retry++
        } else super.fault(event)
    }
}
