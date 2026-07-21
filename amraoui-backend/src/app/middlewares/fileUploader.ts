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

      const isPdf =
        file.mimetype === 'application/pdf' ||
        file.originalname?.toLowerCase().endsWith('.pdf');

      // Non-image files (docs, pdfs, etc.) must use resource_type 'raw' on Cloudinary
      const isRaw =
        file.fieldname === 'document' ||
        file.fieldname === 'invoice' ||
        isPdf ||
        file.mimetype.startsWith('application/') ||
        file.mimetype === 'text/plain' ||
        file.mimetype === 'text/csv';

      // Preserve the original file extension for documents so downloads work correctly
      const originalExt = file.originalname
        ? '.' + file.originalname.split('.').pop()
        : '';

      return {
        folder: folderName,
        allowed_formats: [
          'jpg', 'jpeg', 'png', 'webp', 'mp4',
          'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv',
        ],
        resource_type: isRaw ? 'raw' : 'auto',
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}${isRaw ? originalExt : ''}`,
        use_filename: false,
      };
    },
  });

  const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFieldnames = [
      'image',
      'profile_image',
      'cover_image',
      'product_img',
      'vehicle_carrier_image',
      'dealer_plate_image',
      'invoice',
      'document',
      'id_document_front',
      'id_document_back',
      'license_document_front',
      'license_document_back',
    ];

    // All MIME types we accept
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'video/mp4',
      'application/pdf',
      // Word documents
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Excel documents
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Plain text & CSV
      'text/plain',
      'text/csv',
      // Some OS/browsers send this generic type for office files
      'application/octet-stream',
    ];

    if (file.fieldname === undefined) {
      cb(null, true);
    } else if (allowedFieldnames.includes(file.fieldname)) {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type: ${file.mimetype}`));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const upload = multer({
    storage: storage as any,
    fileFilter: fileFilter as any,
  }).fields([
    { name: 'image', maxCount: 30 },
    { name: 'product_img', maxCount: 10 },
    { name: 'cover_image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
    { name: 'vehicle_carrier_image', maxCount: 1 },
    { name: 'dealer_plate_image', maxCount: 1 },
    { name: 'invoice', maxCount: 1 },
    { name: 'document', maxCount: 10 },
    { name: 'id_document_front', maxCount: 1 },
    { name: 'id_document_back', maxCount: 1 },
    { name: 'license_document_front', maxCount: 1 },
    { name: 'license_document_back', maxCount: 1 },
  ]);

  return upload as any;
};
