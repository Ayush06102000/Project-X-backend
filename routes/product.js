const { Router } = require("express");
const { productModel } = require("../db");
const productRouter = Router();
const { userMiddleware } = require('../middleware/user');

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:"dp3nccyhk",
    api_key:"787171698372227",
    api_secret: "MT2a1K0lismkI4PlrqZ762etCRg"
})

productRouter.get("/preview",async (req,res)=>{
    const products = await productModel.find({})
    res.json({
        products
    });
});


productRouter.post("/products",userMiddleware,async (req,res)=>{
    const {title,description,price,imageUrl} = req.body;
    
    const result = await cloudinary.uploader.upload(imageUrl)

    const newimageUrl = result.url;


    const product = await productModel.create({
        title,description,price,imageUrl:newimageUrl,creatorId:req.userId
    })
    res.json({
        message:"Item Added"
    }) 
}) 



module.exports = {
    productRouter : productRouter
}
