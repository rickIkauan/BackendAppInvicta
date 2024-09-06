const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../config/awsConfig')
require('dotenv').config()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 1024 }
})

module.exports = upload