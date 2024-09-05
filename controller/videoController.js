const Data = require('../models/Video')
const User = require('../models/User')
const s3 = require('../config/awsConfig')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
require('dotenv').config()

// Puxar id de todos os usuários
const getAllUserIds = async (req, res) => {
    const users = await User.find().select('_id')
    return users.map(user => user._id)
}

// Rota para subir treinamento
exports.uploadVideo = async (req, res) => {
    try {
        const { title, subtitle, description, tool } = req.body
        const { file } = req
        const allUsersIds = await getAllUserIds()

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `files/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }

        const command = new PutObjectCommand(params)
        const data = await s3.send(command)

        const newVideo = new Data({
            title,
            subtitle,
            description,
            tool,
            s3url: file.location,
            user: allUsersIds,
            status: allUsersIds.reduce((statusMap, userId) => {
                statusMap[userId] = 'Não iniciado'
                return statusMap
            }, {})
        })

        await newVideo.save()
        res.status(201).json(newVideo)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao enviar o treinamento', err })
    }
}

// Rota para excluir treinamento MongoDB
exports.deleteVideo = async (req, res) => {
    const { id } = req.params
    try {
        const video = await Data.findByIdAndDelete(id)
        if (!video) return res.status(404).json({ message: 'Treinamento não encontrado' })

        res.status(200).json({ message: 'Treinamento excluído com sucesso' })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir o treinamento' })
    }
}

// Rota para listar treinamentos
exports.listVideos = async (req, res) => {
    try {
        const videos = await Data.find()
        res.status(200).json(videos)
    } catch (err) {
        res.status(500).json({ message: 'Erro as listar os treinamentos'})
    }
}

// Rota para atualizar status
exports.updateStats = async (req, res) => {
    try {
        const { title, userId, newStatus } = req.body

        if (!title || !userId || !newStatus) return res.status(400).json({ message: 'Dados insuficientes' })

        const video = await Data.findOne({ title })

        if (!video) return res.status(404).json({ message: 'Treinamento não encontrado' })

        video.status.set(userId, newStatus)

        await video.save()

        res.status(200).json({ message: 'Status atualizado' })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar status' })
    }
}