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

videoSchema.pre('updateOne', async function (next) {
    const update = this.getUpdate()
    if (update.$addToSet && update.$addToSet.user) {
        const video = await this.model.findOne(this.getQuery())

        if (video) {
            const existingUsersIds = new Set(video.user.map(userId => userId.toString()))
            const newUsersIds = update.$addToSet.user.filter(userId => !existingUsersIds.has(userId.toString()))

            if (newUsersIds.lenght > 0) {
                const defaultStatus = {}

                for (const userId of newUserIds) {
                    defaultStatus[userId] = 'Não iniciado'
                }

                await this.model.updateOne(
                    { _id: video._id },
                    { $set: { [`status.${newUsersIds.join(',')}`]: 'Não iniciado' } }
                )
            }
        }
    }
    next()
})

const Data = mongoose.model('Video', videoSchema)

module.exports = Data