
/**
 * 時間の単位をマイクロ秒にする
 */
export const toMS = {
  sec: n => n * 1000,
  minute: n => toMS.sec(n * 60),
  hour: n => toMS.minute(n * 60)
}

export default class {
  running = false
  interval: number
  callback: () => Promise<void>
  id: NodeJS.Timeout

  constructor(callback: () => Promise<void>, interval: number) {
    this.callback = callback
    this.interval = interval
  }

  start = () => {
    this.id = setInterval(
      () => this.callback(),
      this.interval
    )
    this.running = true
  }

  stop = () => {
    this.running= false
    clearInterval(this.id)
  }
}
