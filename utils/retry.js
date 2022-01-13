'use strict'

const { sleep } = require('./sleep')

async function retry (operation, maxAttempts, waitTimeMS) {
  let lastError

  while (maxAttempts-- > 0) {
    try {
      const result = await operation()
      return result
    } catch (err) {
      if (maxAttempts >= 1) {
        console.log(`operation failed, will retry: ${maxAttempts}`)
      } else {
        console.log('no more retries allowed')
      }

      lastError = err

      await sleep(waitTimeMS)
    }
  }

  if (!lastError) {
    throw new Error('Expected there to be an error!')
  }

  throw lastError
}

module.exports = { retry }
