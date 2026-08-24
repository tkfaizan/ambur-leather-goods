import { v2 as cloudinary } from 'cloudinary';

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export { cloudinary };

export function isCloudinaryConfigured(): boolean {
  return isConfigured;
}

export async function uploadImage(file: Buffer, folder: string = 'ambur-leather'): Promise<string> {
  if (!isConfigured) {
    throw new Error('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, API_KEY, and API_SECRET in .env');
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || '');
      }
    ).end(file);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!isConfigured) return;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
