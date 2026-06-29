import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { validateRequest } from '../../middlewares/validateRequest';
import { DriverController } from './drivers.controller';
import { DriverValidation } from './drivers.validation';
import { uploadDriverDocuments } from '../../middlewares/driverDocumentUploader';
import { uploadProfileImage } from '../../middlewares/profileImageUploader';
import { uploadFile } from '../../middlewares/fileUploader';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.getAllDrivers
);

router.get(
  '/my/profile',
  auth(ENUM_USER_ROLE.DRIVER),
  DriverController.getMyProfile
);

router.patch(
  '/my/profile',
  auth(ENUM_USER_ROLE.DRIVER),
  validateRequest(DriverValidation.updateProfileSchema),
  DriverController.updateMyProfile
);

router.post(
  '/my/documents',
  auth(ENUM_USER_ROLE.DRIVER),
  uploadDriverDocuments,
  DriverController.submitMyDocuments
);

router.patch(
  '/my/documents/delete',
  auth(ENUM_USER_ROLE.DRIVER),
  DriverController.deleteMyDocument
);

router.patch(
  '/my/location',
  auth(ENUM_USER_ROLE.DRIVER),
  validateRequest(DriverValidation.updateLocationSchema),
  DriverController.updateMyLocation
);

router.patch(
  '/my/profile-image',
  auth(ENUM_USER_ROLE.DRIVER),
  uploadProfileImage,
  DriverController.uploadProfileImage
);

router.patch(
  '/my/skills',
  auth(ENUM_USER_ROLE.DRIVER),
  validateRequest(DriverValidation.updateSkillsSchema),
  DriverController.updateMySkills
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.getDriverById
);

router.patch(
  '/:id/status',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(DriverValidation.updateDriverStatusSchema),
  DriverController.updateDriverStatus
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  (req, res, next) => {
    console.log('--- POST /drivers ---');
    console.log('Headers:', req.headers);
    console.log('Raw body:', req.body);
    console.log('Raw files:', req.files);
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
        console.log('Parsed body from data:', req.body);
      } catch (e) {
        console.error('Failed to parse req.body.data:', e);
      }
    }
    if (req.files) {
      const files = req.files as any;
      if (files.vehicle_carrier_image && files.vehicle_carrier_image[0]) {
        req.body.vehicle_carrier_image = files.vehicle_carrier_image[0].path;
      }
      if (files.dealer_plate_image && files.dealer_plate_image[0]) {
        req.body.dealer_plate_image = files.dealer_plate_image[0].path;
      }
    }
    next();
  },
  DriverController.createDriverByAdmin
);

router.patch(
  '/:id/documents',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadDriverDocuments,
  DriverController.updateDocumentByAdmin
);

router.patch(
  '/:id/documents/delete',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.deleteDocumentByAdmin
);

router.patch(
  '/:id/documents/status',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.updateDocumentStatus
);

router.patch(
  '/:id/notes',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.updateAdminNotes
);

export const DriverRoutes = router;
