const cloudinary = require('cloudinary').v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { Request } from 'express';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const options = {
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    filename: function (req: Request, file: any, cb: any) {
        cb(null, file.originalname);
    }
}
const storage = new CloudinaryStorage(options);

const uploadCloud = multer({ storage });

export { uploadCloud };
