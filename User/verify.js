import express from "express";
import nodemailer from "nodemailer";


const router = express.Router();

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emilio117kariuki@gmail.com",
    pass: "0722937438",
  },
});

const details={
    from: "emilio117kariuki@gmail.com",
    to: "emilio113kariuki@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
}

router.get('/request', async(req,res)=>{
    try{
        const sent = await mailTransport.sendMail(details);

        if(!sent){
            throw new Error('Email could not be sent')
        }
        res.json({message: "Email sent"})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

export default router
