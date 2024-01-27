import express from "express";
import productManager from "../productManager.js";

const productsRouter = express.Router();
const manager = new productManager("./productos.json");

productsRouter.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const allProduct = await manager.getProducts();
  if (limit && !isNaN(limit)) {
    return res.json({ status: 200, payload: allProduct.slice(0, limit), limit });
  }
  res.json({ status: 200, payload: allProduct, limit: null });
});

productsRouter.get("/:pid", async (req, res) => {
  const idProduct = req.params.pid;
  const product = await manager.getProductById(Number(idProduct));
  if (!product) return res.status(404).json({ error: 'Producto no encontrado', status: 404 });
  res.json({ payload: product, status: 200 });
});

productsRouter.post("/", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const result = await manager.addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  });

  if (result === null) {
    return res.status(400).json({ error: 'Error al agregar el producto', status: 400 });
  }

  res.json({ id: result, status: 201 });
});

productsRouter.put("/:pid", async (req, res) => {
  const idProduct = req.params.pid;
  const updatedProduct = req.body;

  await manager.updateProduct(Number(idProduct), updatedProduct);
  res.json({ status: 200 });
});

productsRouter.delete("/:pid", async (req, res) => {
  const idProduct = req.params.pid;
  await manager.deleteProduct(Number(idProduct));
  res.json({ status: 200 });
});

export default productsRouter;