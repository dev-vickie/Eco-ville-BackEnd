import { Router } from "express";
import prisma from "../db.js";
import { body } from "express-validator";
import { handleErrors } from "../middleware/handleError.js";

const router = Router();

router.post(
  "/",
  body("bio").isString(),
  body("contactPhone"),
  body("location").isString(),
  body("lon"),
  body("lat"),
  body("image").isString(),
  handleErrors,
  async (req, res) => {
    try {
      const profile = await prisma.profile.create({
        data: {
          id: req.user.id,
          bio: req.body.bio,
          contactPhone: req.body.contactPhone,
          location: req.body.location,
          lon: req.body.lon,
          lat: req.body.lat,
          image: req.body.image,
        },
      });
      if (!profile) {
        throw new Error("Could not create profile");
      }

      res.json({ profile });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.get('/', async(req,res)=>{
  try{
    const profile = await prisma.profile.findUnique({
      where:{
        id: req.user.id
      }
    })
    if(!profile){
      throw new Error("Could not fetch the profile")
    }
    res.status(500).json({profile})
  }catch(e){
    res.status(500).json({message: e.message})
  }
})


export default router;
