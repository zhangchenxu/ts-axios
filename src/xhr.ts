import { AxiosRequestConfig } from './types'
export default function xhr(config: AxiosRequestConfig) {
  const { data = null, url, method = 'get', headers } = config
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)
  console.log(data);
  Object.keys(headers).forEach(name => {
    if (data && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })
  request.send(data)
}
