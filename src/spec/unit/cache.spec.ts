import createCache from '../../commons/cache'
import { chmod } from 'fs'

const cacheA = createCache()
const cacheB = createCache()
test('cache動作確認', async () => {
  await cacheA.set('key', 100)
  expect(cacheA.get('key')).toBe(100)
  await cacheA.set('key', 300)
  expect(cacheA.get('key')).toBe(300)

  expect(cacheB.exist('key')).toBeFalsy()
})
