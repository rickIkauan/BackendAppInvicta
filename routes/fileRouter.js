const express = require('express')
const fileMiddleware = require('../middlewares/fileMiddleware')
const fileController = require('../controller/fileController')
const router = express.Router()

router.post('/upload', fileMiddleware.single('file'), fileController.uploadFile) // Rota para subir arquivo
router.delete('/delete/:id', fileController.deleteFile) // Rota para excluir arquivo MongoDb
router.get('/listfiles', fileController.getFiles) // Rota para listar arquivos

module.exports = router