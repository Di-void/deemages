import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { validateUser } from "../middleware/user";
import { uploadImage } from "../controllers/image";
import { fileFilter } from "../utils/helpers";
import multer from "multer";
import { FILE_UPLOAD_LOCATION } from "../config";
import shortUUID from "short-uuid";

const disk = multer.diskStorage({
  // image upload destionation
  destination: `public/images/${FILE_UPLOAD_LOCATION}`,

  filename: function (_req, file, cb) {
    const ext = "." + file.mimetype.split("/")[1];

    // custom file name
    const uid = shortUUID().generate();
    const filename = file.fieldname + "-" + uid + ext;

    cb(null, filename);
  },
});

// TODO: error handling for Multer errors
const upload = multer({
  storage: disk,
  //   ~500kb max
  limits: { fileSize: 500_000, fields: 0, files: 1 },
  fileFilter,
});

const imageRouter = Router();

// guard
imageRouter.use([authMiddleware, validateUser]);

imageRouter.post("/", upload.single("image"), uploadImage);

export { imageRouter };
