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
  const allowedFields = ['license_document', 'id_document', 'contract_document', 'profile_image', 'vehicle_carrier_image', 'dealer_plate_image', 'id_document_front', 'id_document_back', 'license_document_front', 'license_document_back'];
  if (!allowedFields.includes(file.fieldname)) {
    return cb(new Error(`Invalid field: ${file.fieldname}`));
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, WEBP, and PDF files are allowed'));
  }
  cb(null, true);
};

export const uploadDriverDocuments = multer({
  storage: storage as any,
  fileFilter: fileFilter as any,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'license_document', maxCount: 1 },
  { name: 'id_document', maxCount: 1 },
  { name: 'contract_document', maxCount: 1 },
  { name: 'profile_image', maxCount: 1 },
  { name: 'vehicle_carrier_image', maxCount: 1 },
  { name: 'dealer_plate_image', maxCount: 1 },
  { name: 'id_document_front', maxCount: 1 },
  { name: 'id_document_back', maxCount: 1 },
  { name: 'license_document_front', maxCount: 1 },
  { name: 'license_document_back', maxCount: 1 },
]) as any;
