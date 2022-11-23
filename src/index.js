import express, { response } from "express";
import cors from "cors";
import morgan from "morgan";
import { createUser, signInUser, removeAccount } from "../User/user.js";
import { protect } from "../Auth/auth.js";
import postRouter from "../Post/post.js";
import orderRouter from "../Order/order.js";
import bodyParser from "body-parser";
import { adminz } from "../Firebase/firebase.config.js";
import { handleErrors } from "../middleware/handleError.js";
import { body } from "express-validator";
import notificationRouter from "../Firebase/notfication.js";
import payRouter from "../Mpesa/mpesa.js";

export const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/auth", (req, res) => {
  res.render("pages/auth");
});

app.all("/", (req, res) => {
  res.send("This is the home page");
});

app.post("/register", createUser);
app.post("/login", signInUser);
app.post("/remove", protect, removeAccount);

app.use("/post", protect, postRouter);
app.use("/order", protect, orderRouter);
app.use("/notification", protect, notificationRouter);
app.use("/pay", protect, payRouter);

export const start = () => {
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
};
