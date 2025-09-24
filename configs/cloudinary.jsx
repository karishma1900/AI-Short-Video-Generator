import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload any media (audio, video, image) to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} publicId - Cloudinary public ID (e.g., `audio/myfile`)
 * @param {'image' | 'video' | 'raw'} resourceType - Type of file
 * @returns {Promise<string>} Cloudinary URL
 */
export const uploadMediaToCloudinary = async (buffer, publicId, resourceType = 'raw') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: 'AI short video generator',
        public_id: publicId,
        format: resourceType === 'image' ? 'png' : resourceType === 'video' ? 'mp4' : 'mp3',
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};
