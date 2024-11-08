import multer from "multer";
import path from "path";
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (file.fieldname === "doctorPhoto") {
      folder = "doctors/";
    }
    cb(null, "public/uploads/images/" + folder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});

let uploadFileMiddleware = uploadFile;
export default uploadFileMiddleware;
