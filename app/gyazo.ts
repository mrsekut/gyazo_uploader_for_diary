'use server'
import { GYAZO_CONFIG } from "./config";

type GyazoUploadResponse = {
  image_id: string;
  permalink_url: string;
  thumb_url: string;
  url: string;
};

export const uploadToGyazo = async (
  file: File
): Promise<GyazoUploadResponse> => {
  if (!GYAZO_CONFIG.ACCESS_TOKEN) {
    throw new Error(
      "Gyazo access token is not configured. Please set GYAZO_ACCESS_TOKEN in your environment variables."
    );
  }

  const formData = new FormData();
  formData.append("access_token", GYAZO_CONFIG.ACCESS_TOKEN);
  formData.append("imagedata", file);

  const response = await fetch(GYAZO_CONFIG.UPLOAD_URL, {
    method: "POST",
    body: formData,
    mode: "cors",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Gyazo upload failed: ${response.statusText}`);
  }

  return response.json();
};

export const uploadMultipleToGyazo = async (
  files: File[]
): Promise<GyazoUploadResponse[]> => {
  return Promise.all(files.map((file) => uploadToGyazo(file)));
};
