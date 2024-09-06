const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../config/awsConfig')
require('dotenv').config()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'private',
        limits: { fileSize: 1024 * 1024 * 1024 },
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const key = `files/${Date.now()}_${file.originalname}`
            cb(null, key)
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    })
})

module.exports = upload