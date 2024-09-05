const express = require('express')
const router = express.Router()
const videoController = require('../controller/videoController')
const fileMiddleware = require('../middlewares/fileMiddleware')

router.post('/upload', fileMiddleware.single('file'), videoController.uploadVideo) // Rota para subir treinamento
router.delete('/delete/:id', videoController.deleteVideo) // Rota para excluir treinamento do MongoDB
router.get('/listvideo', videoController.listVideos) // Rota para listar treinamentos
router.post('/update', videoController.updateStats) // Rota para atualizar status

module.exports = router