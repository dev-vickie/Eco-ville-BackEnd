import { Mpesa } from "daraja.js";
import { Router } from "express";
import { handleErrors } from "../middleware/handleError.js";
import { body } from "express-validator";

const app = new Mpesa({
  consumerKey: process.env.APP_KEY, // required
  consumerSecret: process.env.APP_SECRET, // required
  securityCredential: process.env.SECURITY,
  organizationShortCode: 174379,
});

const router = Router();

router.post(
  "/",
  body("phone"),
  body("amount"),
  handleErrors,
  async (req, res) => {
    try {
      await app
        .stkPush()
        .amount(req.body.amount)
        .callbackURL("https://example.com/callback")
        .phoneNumber(req.body.phone)
        .lipaNaMpesaPassKey(
          "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
        )
        .send().then((response)=>{
            console.log(response);
        }).catch((error)=>{
            console.log(error);
        })
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

export default router;
