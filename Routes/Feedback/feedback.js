import {Router } from "express";
import { handleErrors } from "../middleware/handleError.js";
import { body } from "express-validator";
import prisma from '../../src/db.js';


const router = Router();


router.post('/',
    body("feedback"),
    handleErrors,
    async(req,res)=>{
        try{
            const feedback = await prisma.feedback.create({
                data:{
                    feedback:req.body.feedback,
                }
            });

            if(!feedback){
                throw new Error("Feedback could not be created");
            }

            res.json({message: "Feedback sent successfully"});
        }catch(e){
            res.status(500).json({message:e.message});
        }
    }
)

router.get('/', async(req,res)=>{
    try{
        const feedback = await prisma.feedback.findMany();
        if(!feedback){
            throw new Error("Could not get feedback");
        }

        res.json({feedback});
    }catch(e){
        res.status(500).json({message:e.message});
  
    }
})

export default router;


