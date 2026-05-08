import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "./env.js";

let _configured = false;

export function getCloudinary() {
  if (!_configured) {
    const env = getEnv();
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    _configured = true;
  }
  return cloudinary;
}
