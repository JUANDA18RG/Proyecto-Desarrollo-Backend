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


exports.optionalUpload = (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(500).send({ message: 'Error al subir el archivo', error: err });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).send({ message: 'Error desconocido al subir el archivo', error: err });
        }
        // Everything went fine and file is optional
        next();
    })
}

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
        console.log('No file provided, but that is okay');
    } else {
        console.log('File uploaded successfully!');
    }
    next();
};