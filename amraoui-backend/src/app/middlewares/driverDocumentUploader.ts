import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/documents/drivers';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf',
];

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedFields = ['license_document', 'id_document', 'contract_document'];
  if (!allowedFields.includes(file.fieldname)) {
    return cb(new Error(`Invalid field: ${file.fieldname}`));
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, WEBP, and PDF files are allowed'));
  }
  cb(null, true);
};

export const uploadDriverDocuments = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'license_document', maxCount: 1 },
  { name: 'id_document', maxCount: 1 },
  { name: 'contract_document', maxCount: 1 },
]);
