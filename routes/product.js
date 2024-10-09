const { Router } = require("express");
const { productModel } = require("../db");
const productRouter = Router();
const { userMiddleware } = require('../middleware/user');


productRouter.get("/preview",async (req,res)=>{
    const products = await productModel.find({})
    res.json({
        products
    });
});


productRouter.post("/products",userMiddleware,async (req,res)=>{
    const {title,description,price,imageUrl} = req.body;

    const product = await productModel.create({
        title,description,price,imageUrl,creatorId:req.userId
    })
    res.json({
        message:"Item Added"
    })
})



module.exports = {
    productRouter : productRouter
}