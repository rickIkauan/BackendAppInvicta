const { PassThrough } = require('stream')

const createFileStream = (content, filename) => {
    const stream = new PassThrough()
    stream.end(content)
    return { stream, filename }
}

module.exports = createFileStream