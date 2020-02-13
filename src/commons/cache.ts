// const cache: {[key: string]: any} = {
//   get: (key: string) => cache[key],

//   set:<T> (key: string, value: T) => {
//     return new Promise<T>((resolve, reject) => {
//       cache[key] = value
//       resolve(value)
//     })
//   },

//   exist: (key: string) => {
//     return cache[key] !== undefined
//   }
// }

type cache_t = {
  get: (key: string) => any,
  set:<T> (key: string, value: T) => Promise<T>,
  exist: (key: string) => boolean
  [key: string]: any
}

const createCache = () => {
  const cache: cache_t = {
    get: (key: string) => cache[key],

    set:<T> (key: string, value: T) => {
      return new Promise<T>((resolve, reject) => {
        cache[key] = value
        resolve(value)
      })
    },

    exist: (key: string) => {
      return cache[key] !== undefined
    }
  }
  return cache
}

export default createCache
