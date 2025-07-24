import { v2 as cloudinary } from 'cloudinary';
import { tmpdir } from 'os';
import { writeFile } from 'fs/promises';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (buffer) => {
  const tempPath = path.join(tmpdir(), `upload_${Date.now()}.pdf`);
  await writeFile(tempPath, buffer);
  const result = await cloudinary.uploader.upload(tempPath, {
    resource_type: 'raw',
    folder: 'recruitpro/resumes',
  });
  return result;
};