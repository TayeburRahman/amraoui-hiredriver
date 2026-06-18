import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'amraoui/profiles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
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
];

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname !== 'profile_image') {
    return cb(new Error(`Invalid field: ${file.fieldname}`));
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, and WEBP files are allowed'));
  }
  cb(null, true);
};

export const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single('profile_image');
