import express, { response } from "express";
import cors from "cors";
import morgan from "morgan";
import { createUser, signInUser, removeAccount } from "../Routes/User/user.js";
import { protect } from "../Routes/Auth/auth.js";
import postRouter from "../Routes/Post/post.js";
import orderRouter from "../Routes/Order/order.js";
import bodyParser from "body-parser";
import notificationRouter from "../Routes/Firebase/notfication.js";
import payRouter from "../Routes/Mpesa/mpesa.js";
import profileRouter from "../Routes/profile/profile.js";
import verifyRouter from "../Routes/User/verify.js";

export const app = express();

app.set("view engine", "ejs");

// Set up the Body Parser to your App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use("/profile", protect, profileRouter);
app.use("/verify", verifyRouter);

export const start = () => {
  app.listen(5000, () => {
    console.log("Server is running on port 6000");
  });
};
