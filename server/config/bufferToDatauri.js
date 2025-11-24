import sharp from "sharp";

export const bufferToDataURI = async (file) => {
  console.log("this is file", file);
  const optimisedImageBuffer = await sharp(file.buffer)
    .resize({ width: 800, height: 800, fit: "inside" })
    .toFormat("jpeg", { quality: 80 })
    .toBuffer();

  const fileUri = `data:image/jpeg;base64,${optimisedImageBuffer.toString(
    "base64"
  )}`;

  return fileUri;
};
