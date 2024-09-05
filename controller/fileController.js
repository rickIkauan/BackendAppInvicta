const File = require('../models/File')
const s3 = require('../config/awsConfig')
const createFileStream = require('../utils/fileUtils')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
require('dotenv').config()

// Rota para subir arquivo
exports.uploadFile = async (req, res) => {
    try {
        const { title, unit, month, service } = req.body
        const { file } = req
        
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `files/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        }

        const command = new PutObjectCommand(params)
        const data = await s3.send(command)

        const newFile = new File({
            title,
            unit,
            month,
            service,
            filename: file.originalname,
            s3url: file.location
        })

        await newFile.save()
        res.status(201).json(newFile)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao enviar o arquivo', err })
    }
}

// Rota para excluir MONGO DB
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params

        const file = await File.findById(id)
        if (!file) {
            return res.status(404).json({ message: 'Arquivo não encontrado' })
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.s3url.split('/files/')[1]
        }

        const command = new DeleteObjectCommand(params)
        await s3.send(command)

        await File.findByIdAndDelete(id)

        res.status(200).json({ message: 'Arquivo excluido com sucesso' })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir o arquivo', err})
    }
}

// Rota para listar
exports.getFiles = async (req, res) => {
    try {
        const files = await File.find()
        res.status(200).json(files)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar arquivos', err})
    }
}