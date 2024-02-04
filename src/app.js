import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}. Presionar Ctrl + C para detener`);
});



