import logger from './logger'

const Rate_Limit_Exceeded = 88

/**
 * ## ErrorHandlung
 * use *.catch(handleError)
 */
export default function handleError(err: TwitterError) {
  switch (err.code) {
    case Rate_Limit_Exceeded: {
      logger.warn(err)
      // Timer.stop(GETTL_REGULAR)
      // setTimeout(
      //   () => Timer.resume(GETTL_REGULAR),
      //   toMS.minute(15)
      // )
    }

    default: {
      logger.error('Uncaught expection')
      logger.error(err)
    }
  }
}

interface TwitterError {
  message: string
  code: number
}
