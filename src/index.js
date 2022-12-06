import express, { response } from "express";
import cors from "cors";
import morgan from "morgan";
import { createUser, signInUser, removeAccount,changePassword } from "../Routes/User/user.js";
import { protect } from "../Routes/Auth/auth.js";
import postRouter from "../Routes/Post/post.js";
import orderRouter from "../Routes/Order/order.js";
import bodyParser from "body-parser";
import notificationRouter from "../Routes/Firebase/notfication.js";
import payRouter from "../Routes/Mpesa/mpesa.js";
import profileRouter from "../Routes/profile/profile.js";
import verifyRouter from "../Routes/User/verify.js";
import feedbackRouter from "../Routes/Feedback/feedback.js";
import passport from "passport";
import '../Routes/Auth/passport/passport.setup.js';
import { profile } from "console";
import session from "express-session";
export const app = express();


app.set("view engine", "ejs");

// Set up the Body Parser to your App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


app.all("/", (req, res) => {
  res.send("This is the home page");
});

app.post("/register", createUser);
app.post("/login", signInUser);
app.post("/remove", protect, removeAccount);
app.put("/changePassword", protect, changePassword);
app.get('/auth', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google', passport.authenticate('google', {failureRedirect: "/error"}), async(req, res)=>{
  const firstName = req.user.name.givenName;
  const lastName = req.user.name.familyName;
  const email = req.user.emails[0].value;
  await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      contactEmail: email,
      password: "pass123",
    }});
  res.json({firstName, lastName, email, password});
});


app.get('/success', (req,res)=>{
  res.json({firstName, lastName, email, password});
})


app.use("/post", protect, postRouter);
app.use("/order", protect, orderRouter);
app.use("/notification", protect, notificationRouter);
app.use("/pay", protect, payRouter);
app.use("/profile", protect, profileRouter);
app.use("/verify", verifyRouter);
app.use("/feedback", protect, feedbackRouter);

export const start = () => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
  });
};
