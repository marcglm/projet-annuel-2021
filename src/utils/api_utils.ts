import BaseResponse from "../responsemodel/BaseResponse";

export function errorPayload<T>(err: Error|undefined, code?: number) : BaseResponse<T> {
  return {
    code: code || 1,
    msg: err && err.message ? err.message : "Unknown error"
  }
}