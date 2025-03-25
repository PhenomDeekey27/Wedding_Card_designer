import axios from "axios";

// ✅ Upload file to Cloudinary and return the URL
const uploadToCloudinary = async (file) => {
  if (!file) {
    console.error("No file to upload.");
    return null;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file); // Pass the raw file
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    const imageUrl = response.data.secure_url;
  
    return imageUrl;
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);
    return null;
  }
};

export default uploadToCloudinary;
