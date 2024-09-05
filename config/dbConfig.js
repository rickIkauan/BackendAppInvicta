const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        })
        console.log('MongoDB conectado')
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err)
        process.exit(1)
    }
}

module.exports = connectDB