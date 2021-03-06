const toString = Object.prototype.toString

export function isObj(val: any): val is Object {
  return typeof val === 'object' && val !== null
}

export function isPlainObj(val: any): val is Object {
  return isObj(val) && toString.call(val) === '[object Object]'
}

export function isDate(val: any): val is Date {
  return isObj(val) && toString.call(val) === '[object Date]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObj(val)) {
          if (isPlainObj(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge({}, val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
