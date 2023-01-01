import express, { response } from "express";
import cors from "cors";
import morgan from "morgan";
import {
  createUser,
  signInUser,
  removeAccount,
  changePassword,
} from "../Routes/User/user.js";
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
import session from "express-session";
import cookieSession from "cookie-session";
// import authRouter from "../Routes/Auth/passport/passport.setup.js";
import GoogleStrategy from "passport-google-oauth2";
import TwitterStrategy from "passport-twitter";
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
app.set('trust proxy', 1)
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2'],
// }))
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      proxy:false
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      passReqToCallback: true,
      proxy: false,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);



app.all("/", (req, res) => {
  res.send("This is the home page");
});

app.post("/register", createUser);
app.post("/login", signInUser);
app.post("/remove", protect, removeAccount);
app.put("/changePassword", changePassword);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google",
  passport.authenticate("google", { failureRedirect: "/error" }),
  async (req, res) => {
    try {
      const firstName = req.user.name.givenName;
      const lastName = req.user.name.familyName;
      const email = req.user.emails[0].value;
      res.header(
        "Access-Control-Allow-Origin",
        "*",
        "Content-Type",
        "application/json"
      );
      res.send(req.user);
    } catch (e) {
      console.log(e.toString());
    }
  }
);


app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter",
  passport.authenticate("twitter", { failureRedirect: "/error" }),
  async (req, res) => {
    res.json(req.user);
  }
);

app.get('/error', (req,res)=>{
  res.send('Error logging in')  
})

app.get('/logout',  async(req,res)=>{
  req.session = null;
  req.logout(function(err) {
    if (err) console.log(err);
    res.redirect('/');
  });
});

app.get("/success", (req, res) => {
  res.json({ firstName, lastName, email, password });
});

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
