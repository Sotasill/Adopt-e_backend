import { v2 as cloudinary } from 'cloudinary';
import getEnvVars from '../utils/getEnvVars.js';

cloudinary.config({
  cloud_name: getEnvVars('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVars('CLOUDINARY_API_KEY'),
  api_secret: getEnvVars('CLOUDINARY_API_SECRET'),
});

export default cloudinary;
