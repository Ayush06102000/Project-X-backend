const { Router } = require('express');
const { userModel, purchaseModel } = require('../db')
const userRouter = Router();
const bcrypt = require('bcrypt')
const {z} = require("zod");
const jwt = require('jsonwebtoken')
const {JWT_USER_PASSWORD} = require("../config");
const { userMiddleware } = require('../middleware/user');


userRouter.post("/signup",async (req,res)=>{
    const requireBody = z.object({
        email:z.string().min(3).max(100).email(),
        password:z.string().min(3).max(100).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[@$!%*?&]/, "Password must contain at least one special character"),
        firstName:z.string().min(3).max(20),
        lastName:z.string().min(3).max(20)
    })
    const parsedDatawithSuccess = requireBody.safeParse(req.body);

    if (!parsedDatawithSuccess.success){
        const error = parsedDatawithSuccess.error;
        console.log(error.message)

        res.json({
            message:parsedDatawithSuccess.error
        })
        return
    }

    const {email,password,firstName,lastName} = req.body;

    hashedpassword = await bcrypt.hash(password,5);

    try{
       await userModel.create({
            email,
            password:hashedpassword,
            firstName,
            lastName
        })
        const user = await userModel.findOne({
            email
        })

        const token = jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD)

        res.json({token:token})
    
    }
    catch(e){
        console.log(e);
        res.send("Something occured")
    }
   
});


userRouter.post("/signin",async (req,res)=>{
    const requireBody = z.object({
        email:z.string().min(3).max(100),
        password:z.string(),
    })
    const parsedDatawithSuccess = requireBody.safeParse(req.body);
    if (!parsedDatawithSuccess.success){
        const error=parsedDatawithSuccess.error;
        console.log(error.messge);
        res.json({
            message:error
        })
        return
    };

    const {email,password} = req.body;
    const response = await userModel.findOne({
        email
    })

    if (!response){
        res.status(403).json({
            message:"Invalid email or password"
        })
        return;
    }

    const passwordMatch = await bcrypt.compare(password,response.password)
    if (passwordMatch){
        const token = jwt.sign({
            id:response._id
        },JWT_USER_PASSWORD)

        res.json({
            token,
            "firstName":response.firstName,
            "lastName":response.lastName
        })
    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
});



module.exports = {
    userRouter : userRouter
}