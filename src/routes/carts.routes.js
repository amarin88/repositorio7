import express from "express";
import cartManager from "../cartManager.js";

const cartsRouter = express.Router();
const manager = new cartManager("./carrito.json");

cartsRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await manager.getCartById(Number(cartId));

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado', status: 404 });
  }

  res.json({ payload: cart, status: 200 });
});


cartsRouter.post("/", async (req, res) => {
  const result = await manager.createCart();

  if (result === null) {
    return res.status(500).json({ error: 'Error al crear el carrito', status: 500 });
  }

  res.json({ id: result, status: 201 });
});


cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity, 10) || 1;

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número positivo', status: 400 });
  }

  await manager.addToCart(Number(cartId), Number(productId), quantity);

  res.json({ status: 200 });
});

export default cartsRouter;