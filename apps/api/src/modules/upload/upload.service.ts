import { getCloudinary } from "../../config/cloudinary.js";
import { getEnv } from "../../config/env.js";

export function generateSignature(folder: string) {
  const cloudinary = getCloudinary();
  const env = getEnv();
  const timestamp = Math.round(Date.now() / 1000);

  const params = {
    timestamp,
    folder: `gharka/${folder}`,
    transformation: "c_limit,w_1200,h_1200,q_auto:good,f_auto",
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    folder: `gharka/${folder}`,
  };
}
