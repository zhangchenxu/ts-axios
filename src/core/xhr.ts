import { IAxiosRequestConfig, IAxiosResponse } from '../types'
import { parserHeaders } from '../helper/headers'
import { parserResponseData } from '../helper/data'
import { createError } from '../helper/error'
import { create } from 'domain'

export default function xhr(
  config: IAxiosRequestConfig
): Promise<IAxiosResponse> {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout
    } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)
    request.onerror = function() {
      reject(createError('Network Error', config, null, request))
    }
    request.ontimeout = function() {
      reject(
        createError(
          `Timeout of ${config.timeout} ms exceeded`,
          config,
          'ECONNABORTED',
          request
        )
      )
    }

    request.onreadystatechange = function(req) {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 0) {
        return
      }
      const responseHeaders = request.getAllResponseHeaders()
      const responseData =
        responseType && responseType !== 'text'
          ? request.response
          : request.responseText
      const response: IAxiosResponse = {
        data: parserResponseData(responseData),
        // data: responseData,
        headers: parserHeaders(responseHeaders),
        statusText: request.statusText,
        status: request.status,
        config,
        request
      }

      handleResponse(response)
    }
    // 处理header
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)

    function handleResponse(response: IAxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}