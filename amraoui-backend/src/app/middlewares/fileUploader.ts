/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';

export const uploadFile = () => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folderName = 'amraoui';

      if (
        file.fieldname === 'cover_image' ||
        file.fieldname === 'profile_image'
      ) {
        folderName = 'amraoui/images/profile';
      } else if (file.fieldname === 'product_img') {
        folderName = 'amraoui/images/products';
      } else if (file.fieldname === 'image') {
        folderName = 'amraoui/images/image';
      } else {
        folderName = 'amraoui/uploads';
      }

      return {
        folder: folderName,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4'],
        resource_type: 'auto',
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      };
    },
  });

  const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFieldnames = [
      'image',
      'profile_image',
      'cover_image',
      'product_img',
    ];

    if (file.fieldname === undefined) {
      cb(null, true);
    } else if (allowedFieldnames.includes(file.fieldname)) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'image', maxCount: 30 },
    { name: 'product_img', maxCount: 10 },
    { name: 'cover_image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
  ]);

  return upload;
};
