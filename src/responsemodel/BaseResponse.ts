/**
 * code
 * 0 = success
 * other = error
 */
export default interface BaseResponse<T> {
    code: number
    msg?: string
    payload?: T
}