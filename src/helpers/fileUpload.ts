import multer from 'multer'
import path from 'path'

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../src/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpg|jpeg|png|pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        return cb(null, false)
    }
}

const upload = multer({
    storage: Storage,
    limits: {
        fileSize: 8000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})

export default upload