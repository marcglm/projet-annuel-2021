import BaseResponse from "../responsemodel/BaseResponse";

export function errorPayload<T>(err: Error, code?: number) : BaseResponse<T> {
  return {
    code: code || 1,
    msg: err.message
  }
}