import multer from "multer";
import { v4 } from "uuid";
import { resolve } from "path";
import fs from "fs";

const path = resolve();
let reference = undefined;
let destFolder = undefined;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    reference = req.body.reference;
    const ext = file.mimetype.split("/").slice(0, -1);
    if (ext[0] === "image") {
      destFolder = `${path}/src/presentation/public/images/${reference}`;
    } else {
      destFolder = `${path}/src/presentation/public/documents`;
    }

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder);
    }
    cb(null, destFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = v4();
    const extension = file.mimetype.split("/").pop();
    const name = `${uniqueSuffix}.${extension}`;
    req.body = {
      name,
      reference: `${destFolder}/${name}`,
    };
    cb(null, name);
  },
});

export const uploader = multer({ storage });
