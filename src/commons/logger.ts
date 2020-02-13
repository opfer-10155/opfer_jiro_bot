import log4js = require("log4js")
const today = new Date()

log4js.configure({
  appenders : {
    system : {type : 'file', filename : `./log/${today}_system.log`}
  },
  categories : {
    default : {appenders : ['system'], level : 'debug'},
  }
});

const logger = log4js.getLogger('system');

logger.debug('start')

export default logger
