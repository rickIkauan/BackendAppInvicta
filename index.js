const express = require('express')
const connectDB = require('./config/dbConfig')
const fileRoutes = require('./routes/fileRouter')
const authRoutes = require('./routes/authRoutes')
const videoRoutes = require('./routes/videoRoutes')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000

connectDB()

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}))

app.use(express.json({ limit: '1024mb' }))
app.use(express.urlencoded({ extended: true, limit: '1024mb' }))

app.get('/', (req, res) => {
    res.json({ message: 'Backend app invicta' })
})

app.use('/api/files', fileRoutes)
app.use('/api/user', authRoutes)
app.use('/api/video', videoRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Algo deu errado' })
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

module.exports = app