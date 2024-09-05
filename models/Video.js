const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    s3url: {
        type: String,
        required: true
    },
    tool: {
        type: String,
        required: true
    },
    status: {
        type: Map,
        of: String,
        default: {}
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
})

const Data = mongoose.model('Video', videoSchema)

module.exports = Data