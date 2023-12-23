import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLODINARY_SECRET
})

const uploadOnCloudnary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
       const uploadedFile = await cloudinary.uploader(localFilePath , {
            resource_type : "auto"
        })
        //file has been uploaded successfully
        console.log("file has been uploaded on cloudinary ", uploadedFile.url)

        return uploadedFile;
    }catch(error){

        fs.unlinkSync(localFilePath) // remove the locally saved temporarly file as the upload operation got failed
        console.log('Error in uploading image to Cloudinary', error);

    }
}


export {uploadOnCloudnary}