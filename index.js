const express = require("express");
const fs = require("fs");
const multer  = require('multer')
const cloudinary = require("cloudinary").v2;
require('dotenv').config();
const path = require("path");





const server = express();
const Port = 8779;

server.use(express.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads');
        }
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  });
  
  const upload = multer({ storage: storage })

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET

  });

  

server.post('/profile', upload.single('avatar'),async function (req, res, next) {
   
try {
    console.log(req.file);

    const uploadResult = await cloudinary.uploader.upload(req.file.path,{
        public_id :"chetan",
    });

    console.log(uploadResult);

     return  res.status(200).json({
        message:"file uploaded",
        cloudinaryurl: uploadResult.secure_url
    });

} catch (error) {
    console.error(error);

  return res.status(500).json({message:"server error"});

    
}
  });






server.listen(Port,()=>{
    console.log("server is running");
});











