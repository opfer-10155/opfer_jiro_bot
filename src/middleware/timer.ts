type ACTION = 'GETTL' |
              'RESET_TWEET_COUNT' |
              'RESET_GETTL_COUNT' |
              'AUTOMATIC_TWEET' |
              'SEARCH'

/**
 * 時間の単位をマイクロ秒にする
 */
export const toMS = {
  sec: n => n * 1000,
  minute: n => toMS.sec(n * 60),
  hour: n => toMS.minute(n * 60)
}

export const GETTL_REGULAR = 'GETTL'
export const SEARCH_REGULAR = 'SEARCH'
export const RESET_TWEET_COUNT = 'RESET_TWEET_COUNT'
export const RESET_GETTL_COUNT = 'RESET_GETTL_COUNT'
export const AUTOMATIC_TWEET = 'AUTOMATIC_TWEET'

const timer = {
  start: (type: ACTION, callback: Function, interval: number, ...args: any[]) => {
    timer[type] = new  Timer(callback, interval, args)
    return timer[type].id
  },

  stop: (type: ACTION) => {
    if (timer[type]) {
      timer[type].stop()
      return true
    }
    return false
  },

  resume: (type: ACTION) => {
    if (timer[type]) {
      timer[type].start()
      return true
    }
    return false
  }
}

export default timer

class Timer {
  id: number
  callback: Function
  args: any[]
  interval: number
  isStopped: boolean = false

  constructor(callback: Function, interval: number, ...args: any[]) {
    this.callback = callback
    this.interval = interval
    this.id = setInterval(callback, interval, args)
  }

  start() {
    this.isStopped = false
    this.id = setInterval(this.callback, this.interval, this.args)
  }
  stop = () => {
    this.isStopped = true
    clearInterval(this.id)
  }
}