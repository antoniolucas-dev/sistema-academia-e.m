import multer from "multer";
import path from "path";
import fs from "fs";

const DESTINO = "public/uploads/perfil";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(DESTINO, { recursive: true });
    cb(null, DESTINO);
  },

  filename: (req, file, cb) => {
    const nomeArquivo =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, nomeArquivo);
  }
});

const uploadPerfil = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const ok = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    if (ok) {
      cb(null, true);
    } else {
      cb(new Error("Formato de imagem inválido. Use JPG, PNG ou WEBP."));
    }
  }
});

export default uploadPerfil;