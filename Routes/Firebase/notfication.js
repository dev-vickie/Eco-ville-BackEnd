import { Router } from "express";
import { body } from "express-validator";
import { handleErrors } from "../middleware/handleError.js";
import { adminz } from "./firebase.config.js";

const router = Router();
const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

router.post(
  "/",
  body("title").isString(),
  body("body").isString(),
  handleErrors,
  async (req, res) => {
    req.header("Content-Type", "application/json");
    // const registrationToken = req.body.registrationToken;
    const message = {
      notification: {
        title: req.body.title,
        body: req.body.body,
      },
    };
    const options = notification_options;
    var topic = "all";

    adminz
      .messaging()
      .sendToTopic(topic, message, options)
      .then((response) => {
        res.status(200).send("Notification sent successfully");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

router.post(
  "/device",
  body("title").isString(),
  body("body").isString(),
  body("token").isString(),
  handleErrors,
  async (req, res) => {
    req.header("Content-Type", "application/json");
    const registrationToken = req.body.token;
    const message = {
      notification: {
        title: req.body.title,
        body: req.body.body,
      },
    };
    const options = notification_options;
    adminz
      .messaging()
      .sendToDevice(registrationToken, message, options)
      .then((response) => {
        res.status(200).send("Notification sent successfully");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

export default router;
