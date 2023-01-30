import prisma from '../../src/db.js';
import { body } from "express-validator";
import {
  hashPassword,
  comparePassword,
  createJWT,
} from "../Auth/auth.js"
import { handleErrors } from "../middleware/handleError.js";


export const createUser =
  (body("firstName").isString(),
  body("lastName").isString(),
  body("contactEmail").isString(),
  body("password"),
  handleErrors,
  async (req, res) => {
    try {
      var user = await prisma.user.create({
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          contactEmail: req.body.contactEmail,
          password: await hashPassword(req.body.password),
          // password: req.body.password
        },
      });
      if (!user) {
        throw new Error("user could not be created");
      }
      const token = createJWT(user);

      res.json({
        message: "User has been registered successfully",
        token: token,
        id: user.id,
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });

export const signInUser =
  (body("contactEmail").isString(),
  body("password").isString(),
  handleErrors,
  async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          contactEmail: req.body.contactEmail,
        },
      });

      const isValid = await comparePassword(req.body.password, user.password);

      if (!isValid) {
        throw new Error("Error signing user");
      }
      const token = createJWT(user);

      res.json({ id:user.id, token });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });

export const removeAccount = async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        contactEmail: req.body.contactEmail,
      },
    });
    if (!user) {
      throw new Error("Could not remove account");
    }

    res.json({ message: "Account removed successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const changePassword = async (req,res)=>{
  try{
    const password = await prisma.user.update({
      where:{
        id: req.user.id
      },
      data:{
        password: await hashPassword(req.body.password),
      }
    });

    if(!password){
      throw new Error("Password could not be changed")
    }

    res.json({message: "password changed successfully"})

  }catch(e){
    res.status(500).json({message:e.message});
  }
}
