import timer, { toMs } from '../../src/middleware/timer'

wait = async () => {
  setTimeout(()=>{}, toMs.sec(5))
}

describe('timerにkey名によって関数を登録する', () => {
  const NAME = 'NAME'
  let n = 0
  const add1 = () => {n++}
  timer.start(NAME, add1, toMs.sec(1))

  it('関数が登録されている', () => {
    expect(timer[NAME].callback).toBe(add1)
  })

  setTimeout(() => {
    it('関数が実行されている', () => {
      expect(n).toBeGreaterThan(0)
    }),
    toMs.sec(5)
  })

  it('timer.stopが正常である', () => {
    expect(timer.stop(NAME)).toBeTruthy()
    expect(timer.stop('unko')).toBeFalsy()
  })

  n = 0
})
