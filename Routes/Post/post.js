import { body } from "express-validator";
import prisma from '../../src/db.js';
import { Router } from "express";
import { handleErrors } from "../middleware/handleError.js";

const router = Router();

router.post(
  "/",
  body("name").isString(),
  body("location").isString(),
  body("lon"),
  body("lat"),
  body("type").isIn(["GLASS", "ORGANIC", "PLASTIC", "METAL", "ELECTRONIC"]),
  body("image").isString(),
  body("description").isString(),

  handleErrors,
  async (req, res) => {
    try {
      req.header("Content-Type", "application/json");

      const post = await prisma.post.create({
        data: {
          name: req.body.name,
          location: req.body.location,
          lon: req.body.lon,
          lat: req.body.lat,
          image: req.body.image,
          description: req.body.description,
          type: req.body.type,
          belongsToId: req.user.id,
        },
      });

      if (!post) {
        throw new Error("Post could not be created");
      }

      res.json({ message: "Post has been created successfully", id: post.id });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    req.header("Content-Type", "application/json");

    const posts = await prisma.post.findMany(
      
    );
    if (!posts) {
      throw new Error("Could not get posts");
    }

    res.send(posts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/type/:id", async (req, res) => {
  try {
    req.header("Content-Type", "application/json");

    const posts = await prisma.post.findMany(
      {
        where: {
          type: req.params.id
        }
      }

      
    );
    if (!posts) {
      throw new Error("Could not get posts");
    }

    res.send(posts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


router.get("/user/:id", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        belongsToId: req.user.id,
      },
    });

    if (!posts) {
      throw new Error("Could not fetch posts");
    }

    res.json({ posts });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    req.header("Content-Type", "application/json");

    const posts = await prisma.post.findMany({
      where: {
        id: req.params.id,
      },
    });

    if (!posts) {
      throw new Error("Could not fetch post");
    }

    res.json({ posts });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete(
  "/:id",
  body("userId").isString(),
  handleErrors,

  async (req, res) => {
    try {
      req.header("Content-Type", "application/json");

      const post = await prisma.post.delete({
        where: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      });
      if (!post) {
        throw new Error("Could not delete post");
      }
      res.json({ message: "Post deleted successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.put(
  "/:id",
  body("name").isString(),
  body("location").isString(),
  body("lon"),
  body("lat"),
  body("image").isString(),
  body("description").isString(),
  handleErrors,

  async (req, res) => {
    try {
      req.header("Content-Type", "application/json");

      const post = await prisma.post.update({
        where: {
          id: req.params.id,
        },
        data: {
          name: req.body.name,
          location: req.body.location,
          lon: req.body.lon,
          lat: req.body.lat,
          image: req.body.image,
          description: req.body.description,
          type: req.body.type,
        },
      });
      if (!post) {
        throw new Error("Could not update post");
      }
      res.json({ message: "Order updated successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

export default router;
