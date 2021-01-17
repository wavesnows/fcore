import OperEvent from '../../wavesnows/event/OperEvent'

/**
 * Interface for oper handlers.
 *
 * @export
 * @interface IOperHandler
 * @template TSender The sender type.
 * @template TArgs The arguments type.
 */
interface IOperHandler<TSender, TArgs> {
    (sender: TSender, args: TArgs, event: OperEvent): void
}

export default IOperHandler
