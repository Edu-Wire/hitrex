// Cloudinary Image Upload Utility
// =================================
// Purpose: Handle image uploads to Cloudinary
// Usage: Upload images and get secure URLs

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddizjvtbx',
  api_key: process.env.CLOUDINARY_API_KEY || '244937695723275',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Hnfh_NbprgfHOtO5wX4mVrnnHwE',
  secure: true
});

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Secure image URL
 */
export async function uploadImage(file, folder = 'trekking-adventure') {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          format: 'webp',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export function getPublicIdFromUrl(url) {
  if (!url) return '';
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
}

export default cloudinary;
