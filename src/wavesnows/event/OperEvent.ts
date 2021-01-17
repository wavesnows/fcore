import Oper from '../oper/Oper'

export default class OperEvent {
    public type: string

    /**
     * 开始
     */

    public static OPERATION_START: string = 'operation_start'

    /**
     * 请求完成
     */

    public static OPERATION_COMPLETE: string = 'operation_complete'

    /**
     * 请求失败
     */

    public static OPERATION_ERROR: string = 'operation_error'

    /**
     * 子对象开始
     */

    public static CHILD_OPERATION_START: string = 'child_operation_start'

    /**
     * 子对象请求完成
     */

    public static CHILD_OPERATION_COMPLETE: string = 'child_operation_complete'

    /**
     * 子对象请求失败
     */

    public static CHILD_OPERATION_ERROR: string = 'child_operation_error'

    /**
     * 加载器
     */
    public oper: Oper | undefined

    /**
     * 子加载器
     */
    public childOper: Oper | undefined

    /**
     * 返回结果
     */
    public result: any = undefined

    constructor(type: string, oper?: Oper, childOper?: Oper) {
        this.type = type
        this.oper = oper
        this.childOper = childOper
    }
}
