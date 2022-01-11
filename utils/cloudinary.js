//STEP 36
const cloudinary = require("cloudinary");

//get your config details from your accout and store them in .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUploadImg = async (fileToUploaUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUploaUpload, {
      resource_type: "auto",
    });
    return{ url: data.secure_url};
  } catch (error) {
    return error;
  }
}

module.exports = cloudinaryUploadImg; //Require this module in userCtrl.js