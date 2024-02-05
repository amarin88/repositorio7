import express from "express";
import productManager from "../productManager.js";

const viewsRouter = express.Router();
const manager = new productManager("./productos.json");

viewsRouter.get("/home", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

viewsRouter.get("/realTimeProducts", async (req, res) => {
  const products = await manager.getProducts();
  res.render("realTimeProducts", { products });
});

export default viewsRouter;
