import { CLOUDINARY_UPLOAD_URL, cloudinaryConfig } from "../config/cloudinary";

/**
 * Uploads a file to Cloudinary using unsigned uploads.
 * Requires env vars:
 *  - REACT_APP_CLOUDINARY_CLOUD_NAME
 *  - REACT_APP_CLOUDINARY_UPLOAD_PRESET (unsigned preset)
 *
 * @param {File|Blob} file - browser File/Blob
 * @param {Object} options - optional Cloudinary params (e.g., folder, tags)
 * @returns {Promise<Object>} Cloudinary upload response (JSON)
 */
export async function uploadToCloudinary(file, options = {}) {
  if (!file) throw new Error("No file provided for upload.");
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    throw new Error("Cloudinary env vars are missing. Please set cloud name and upload preset.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} ${message}`);
  }

  return response.json();
}
