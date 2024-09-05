const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    units: {
        type: [String],
        required: true
    },
    tools: {
        type: [String],
        required: true
    },
    services: {
        type: [String],
        required: true
    },
    admin: {
        type: String,
        required: true
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            next()
    } catch (err) {
        next (err)
    }
})

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User