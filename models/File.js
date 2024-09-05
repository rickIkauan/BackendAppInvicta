const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    s3url: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const File = mongoose.model('File', fileSchema)

module.exports = File