import { v2 as cloudinary } from 'cloudinary';
import config from './index';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
  timeout: 120000, // 120 seconds timeout to handle large image uploads
});

console.log('Cloudinary config:', {
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key ? '***' : undefined,
  api_secret: config.cloudinary.api_secret ? '***' : undefined,
});

export default cloudinary;
