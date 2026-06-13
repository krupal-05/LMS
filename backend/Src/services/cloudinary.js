import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_api,
  api_secret: process.env.cloudinary_secret,
});

// Upload an image
const uploadCloud = async (localpath) => {
  try {
    if (!localpath) return null;
    const upload = cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlink(localpath);
    return null;
  } catch (error) {
    fs.unlink(localpath);
    return null;
  }
};

export { uploadCloud };
