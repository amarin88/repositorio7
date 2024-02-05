import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import http from "http";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";

const PORT = 8080;
const app = express(); 

const httpServer = http.createServer(app);
const io = new Server(httpServer);


app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname , "../views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado: ', socket.id);


socket.on('addProduct', (data) => {
    
    io.emit('updateProducts', data);

    console.log('Producto agregado:', data);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}. Presionar Ctrl + C para detener`);
});