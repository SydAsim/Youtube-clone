// multer.diskStorage() is a factory function provided by
// Multer that returns a storage engine object
// it defines how and where to store uploaded files on your disk.
import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb( null ,"./public/temp")
    },

    filename: function(req,file,cb){
        cb( null , file.originalname)
    },

})

export const upload = multer({storage})


// Client sends file → Multer triggers diskStorage() →
// destination(req, file, cb) → set folder
// filename(req, file, cb) → set name
// → File is written → req.file attached → next middleware
