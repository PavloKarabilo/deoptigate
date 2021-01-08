const BROWSER_TRACE_RE = /(.*):([0-9]+):([0-9]+)$/

module.exports = function normalizeFile(file) {
  if (file.indexOf('https://') === 0 || file.indexOf('http://') === 0 || file.indexOf('file:') === 0) {
    const array = BROWSER_TRACE_RE.exec(file)
    return !array ? file : array[1];
  }
  return file.split(':')[0]
}
