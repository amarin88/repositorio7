import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
      const newCart = {
        id,
        products: []
      };
      carts.push(newCart);
      await this.saveToFile(carts);
      console.log(`Carrito creado exitosamente con ID: ${newCart.id}`);
      return id;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      return null;
    }
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al obtener carritos:', error);
      return [];
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const foundCart = carts.find((cart) => cart.id === id);
      if (!foundCart) {
        console.log('Carrito no encontrado.');
        return null;
      }
      return foundCart;
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error);
      return null;
    }
  }

  async addToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex < 0) {
        console.log('Carrito no encontrado.');
        return;
      }
      const productIndex = carts[cartIndex].products.findIndex((item) => item.id === productId);
      if (productIndex >= 0) {
        carts[cartIndex].products[productIndex].quantity += quantity;
      } else {
        carts[cartIndex].products.push({ id: productId, quantity });
      }
      await this.saveToFile(carts);
      console.log(`Producto agregado al carrito ${cartId} exitosamente.`);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  }

  async saveToFile(carts) {
    try {
      const json = JSON.stringify(carts, null, 2);
      await fs.writeFile(this.path, json);
    } catch (error) {
      console.log('Error al escribir el archivo del carrito: ', error);
    }
  }

}

export default CartManager;