import Timer, { toMS, GETTL_REGULAR } from './timer'

const Rate_Limit_Exceeded = 88

/**
 * ## ErrorHandlung
 * use *.catch(handleError)
 */
export default function handleError(err: TwitterError) {
  const now = new Date();
  console.error("error occured at ", now);
  console.error(err);
  switch (err.code) {
    case Rate_Limit_Exceeded: {
      Timer.stop(GETTL_REGULAR)
      setTimeout(
        () => Timer.resume(GETTL_REGULAR),
        toMS.minute(15)
      )
    }

    default: {
      console.error('Uncaught expection')
    }
  }
}

interface TwitterError {
  message: string
  code: number
}
