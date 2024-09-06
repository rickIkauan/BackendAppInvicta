const Data = require('../models/Video')
const User = require('../models/User')
const s3 = require('../config/awsConfig')
const { Upload } = require('@aws-sdk/lib-storage')
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const { param } = require('..')
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
        const file = req.file
        const allUsersIds = await getAllUserIds()

        if (!file) {
            return res.status(400).json({ message: 'Arquivo não encontrado ou inválido.' })
        }
        console.log('File:', file)

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `files/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }

        const upload = new Upload({
            client: s3,
            params: params,
            queueSize: 4,
            partSize: 1024 * 1024 * 1024,
            leavePartsOnError: false
        })

        const data = await upload.done()

        const newVideo = new Data({
            title,
            subtitle,
            description,
            tool,
            s3url: data.Location,
            user: allUsersIds,
            status: allUsersIds.reduce((statusMap, userId) => {
                statusMap[userId] = 'Não iniciado'
                return statusMap
            }, {})
        })

        await newVideo.save()
        res.status(201).json(newVideo)
    } catch (err) {
        console.error('Erro ao enviar o treinamento:', err)
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