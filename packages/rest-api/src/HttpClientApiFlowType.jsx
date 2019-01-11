import type { Response, SuccessResponse, ErrorResponse } from './requestApi/ResponseFlowType';

export type HttpClientApi = {
  get: (url: string, params: any, responseType?: string) => Promise<Response>,
  post: (url: string, data: any, responseType?: string) => Promise<Response>,
  put: (url: string, data: any, responseType?: string) =>  Promise<Response>,
  getBlob: (url: string, params: any) => Promise<Response>,
  postBlob: (url: string, params: any) => Promise<Response>,
  postAndOpenBlob: (url: string, params: any) => Promise<Response>,
  getAsync: (url: string, params: any) => Promise<Response>,
  postAsync: (url: string, params: any) => Promise<Response>,
  putAsync: (url: string, params: any) => Promise<Response>,
  isAsyncRestMethod: (restMethod: any) => boolean,
  getMethodName: (restMethod: any) => string,
  setResponseHandlers: (successHandler: (response: SuccessResponse) => SuccessResponse, errorHandler: (error: ErrorResponse) => ErrorResponse) => void,
}
