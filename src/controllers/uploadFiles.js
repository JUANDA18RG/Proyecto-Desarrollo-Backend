const multer = require('multer');
const fs = require('fs');

// Create a storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination folder where the file will be saved
        cb(null, 'src/assets');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Create a file filter for multer
const fileFilterAndAdmin = (req, file, cb) => {
    // Accept images only
    try{
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Solo imagenes son permitidas'), false);
        }
        cb(null, true);
    }catch(error){
        return res.status(500).send({message: 'no se pudo controlar el error',error});
    }

};

// Create the multer middleware
const upload = multer({ storage: storage, fileFilterAndAdmin});

exports.upload = upload.single('file');

exports.uploadFile = async (req, res, next) => {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (req.fileValidationError) {
        try {
            await fs.promises.unlink(req.file.path);
        } catch (err) {
            console.error(err);
            return res.status(500).send('no se pudo controlar el error', err);
        }
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        console.log('Please select an image to upload');
        return res.status(404).send({message: 'por favor selecciona una imagen para cargar'});
    }
    console.log('File uploaded successfully!');
    next();
};