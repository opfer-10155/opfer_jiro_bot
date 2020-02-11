
/**
 * 時間の単位をマイクロ秒にする
 */
export const toMS = {
  sec: n => n * 1000,
  minute: n => toMS.sec(n * 60),
  hour: n => toMS.minute(n * 60)
}

export default class Timer {
  id: number
  callback: Function
  args: any[]
  interval: number
  isStopped: boolean = false

  constructor(callback: Function, interval: number, ...args: any[]) {
    this.callback = callback
    this.interval = interval
    this.args = args
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