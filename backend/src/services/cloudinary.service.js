import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOULDINARY_NAME,
  api_key: process.env.CLOULDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRATE
});
// Upload an image
const uploadCloud = async (localpath) => {
  try {
    if (!localpath) return null;

    const upload = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto"
    });

    // if file upload success fully
    console.log("file successfullly uploaded on cloudinary ", upload);
    await fs.unlinkSync(localpath);

    return upload;

  } catch (error) {


    // remove local temp file if faild
    if (localpath) {
      await fs.unlinkSync(localpath);
      console.log("faild to upload on cloudinary", error);

    }
    return null;

  }
};

export { uploadCloud };
