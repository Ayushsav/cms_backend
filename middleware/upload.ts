// src/middlewares/upload.ts
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const fileTypes = /csv/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extName) {
    return cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
