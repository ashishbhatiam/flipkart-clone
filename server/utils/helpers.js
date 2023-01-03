const _ = require('lodash')

function formatBytes (a, b = 2) {
  if (!+a) return '0 Bytes'
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024))
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
    ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
  }`
}

function getHostUrl (request) {
  return `${request.protocol}://${request.get('host')}`
}

const _pickObj = (obj, keys) => {
  return _.pick(obj, keys)
}

module.exports = {
  formatBytes,
  getHostUrl,
  _pickObj
}
