const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

let nodeModulesLocation = cwd;

while(!fs.existsSync(path.join(nodeModulesLocation, 'node_modules', 'next/dist/build/output/log.js'))){
  nodeModulesLocation = path.resolve(path.join(nodeModulesLocation, ".."));
  if(nodeModulesLocation === "/"){
    throw new Error("No node_modules/next/dist/build/output/log found");
  }
}

const LOGGER_PATH = path.join(nodeModulesLocation, 'node_modules', 'next/dist/build/output/log');

console.log(LOGGER_PATH);

// eslint-disable-next-line import/no-dynamic-require
const logger = require(LOGGER_PATH)

const buildJsonLogger = (prefix) => {
  // eslint-disable-next-line global-require
  const pino = require('pino')({ name: 'next.js' })
  const getLogMethod = (method) => {
    switch (method) {
      case 'error':
        return pino.error.bind(pino)
      case 'warn':
        return pino.warn.bind(pino)
      default:
        return pino.info.bind(pino)
    }
  }

  return (...msg) => {
    getLogMethod(prefix)({ msg: msg.join(', '), prefix })
  }
}

Object.entries(logger).forEach(([key, value]) => {
  if (typeof value === 'function') {
    logger[key] = buildJsonLogger(key)
  }
})
