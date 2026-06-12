import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'amraoui/documents/drivers',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      resource_type: 'auto',
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
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
