import multer from "multer";
import path from "path";


const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      "public/uploads/alunos"
    );

  },


  filename: (req, file, cb) => {

    const nomeArquivo =
      Date.now() +
      path.extname(file.originalname);


    cb(
      null,
      nomeArquivo
    );

  }

});


const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  }

});


export default upload;