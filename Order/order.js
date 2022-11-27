import { Router } from "express";
import { body } from "express-validator";
import { handleErrors } from "../middleware/handleError.js";
import prisma from "../db.js";
import { rmSync } from "fs";

const router = Router();

router.get("/", async (req, res) => {
  req.header("Content-Type", "application/json");

  try {
    const orders = await prisma.order.findMany({
      where: {
        belongsToId: req.user.id,
      },
    });
    if (!orders) {
      throw new Error("Could not fetch orders");
    }
    res.json({ orders });
  } catch (e) {
    rmSync.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  req.header("Content-Type", "application/json");

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!order) {
      throw new Error("Could not fetch orders");
    }
    res.json({ order });
  } catch (e) {
    rmSync.status(500).json({ message: e.message });
  }
});

router.post(
  "/",
  body("name").isString(),
  body("location").isString(),
  body("lon"),
  body("lat"),
  body("image").isString(),
  body("amount_bid"),
  body("quantity").isIn(["SMALL", "MEDIUM", "HIGH"]),
  body("token").isString(),
  handleErrors,
  async (req, res) => {
    req.header("Content-Type", "application/json");

    try {
      const order = await prisma.order.create({
        data: {
          id: req.user.id,
          name: req.body.name,
          location: req.body.location,
          lon: req.body.lon,
          lat: req.body.lat,
          image: req.body.image,
          amount_bid: req.body.amount_bid,
          belongsToId: req.user.id,
          quantity: req.body.quantity,
        },
      });
      if (!order) {
        throw new Error("The order could not be placed");
      }
      // orderNotification("Order has been placed Successfully",req.body.name,req.body.token)
      res.json({ message: "Order placed successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.put(
  "/",
  body("name").isString(),
  body("location").isString(),
  body("lon"),
  body("lat"),
  body("amount_bid"),
  body("quantity").isIn(["SMALL", "MEDIUM", "HIGH"]),
  handleErrors,
  async (req, res) => {
    req.header("Content-Type", "application/json");

    try {
      const order = await prisma.order.create({
        data: {
          id: req.user.id,
          name: req.body.name,
          location: req.body.location,
          lon: req.body.lon,
          lat: req.body.lat,
          amount_bid: req.body.amount_bid,
          quantity: req.body.quantity,
        },
      });
      if (!order) {
        throw new Error("The order could not be updated");
      }
      res.json({ message: "Order updated successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  req.header("Content-Type", "application/json");

  try {
    const order = await prisma.order.delete({
      where: {
        id: req.params.id,
      },
    });

    if (!order) {
      throw new Error("Order could not be deleted");
    }

    res.json({ message: "Order has been deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
