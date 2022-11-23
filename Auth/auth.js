import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET
  );
  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(500).json({ message: "unauthorized" });
    return;
  }

  const tokenArray = bearer.split(" ");
  const token = tokenArray[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      throw new Error("User is not authorized");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
