import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import ProductManager from "./productManager.js";

const PORT = 8080;
const app = express(); 

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}. Presionar Ctrl + C para detener`);
});
const io = new Server(httpServer)


app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname , "../views"));
app.set("view engine", "handlebars");
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const manager = new ProductManager("./productos.json");

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado: ", socket.id);

  socket.on("addProduct", async (data) => {
    const productId = await manager.addProduct(data);
    if (productId) {
      io.emit("updateProducts", data);
      console.log("Producto agregado con ID:", productId);
    }
  });

  socket.on("updateProduct", async (data) => {
    await manager.updateProduct(data.id, data);
    io.emit("updateProducts", data);
    console.log("Producto actualizado:", data);
  });

  socket.on("removeProduct", async (id) => {
    await manager.deleteProduct(id);
    io.emit("status-changed", { message: `Producto con ID ${id} eliminado.` });
    console.log("Producto eliminado:", id);
  });
});