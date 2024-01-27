import fs from "fs/promises"

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('¡Faltan propiedades del producto!');
            return null;
        }

        try {
            const products = await this.getProducts();
            const codeExists = products.find((prod) => prod.code === code);
            if (codeExists) {
                console.log('El código ya existe.');
                return null;
            }
            
            const id = products.length ? products[products.length - 1].id + 1 : 1;

            const newProduct = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id,
            };

            products.push(newProduct);
            await this.saveToFile(products);
            console.log(`Producto agregado exitosamente con ID: ${newProduct.id}`);
            
            return id;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const foundProduct = products.find((prod) => prod.id === id);

            if (!foundProduct) {
                console.log('Producto no encontrado.');
                return null;
            }

            return foundProduct;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }

    async updateProduct(id, obj) {
        try {
            const products = await this.getProducts();
            const existingProduct = products.findIndex((prod) => prod.id === id);

            if (existingProduct < 0) {
                console.log('Producto no encontrado.');
                return;
            }

            const codeExists = products.some((prod) => prod.code === code && prod.id !== id);
            if (codeExists) {
                console.log('El código ya existe.');
                return;
            }

            products[existingProduct] = { ...products[existingProduct], ...obj };

            await this.saveToFile(products);
            console.log(`Producto ${id} actualizado exitosamente.`);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const filteredProducts = products.filter((product) => product.id !== id);
    
            if (filteredProducts.length === products.length) {
                console.log('Producto no encontrado.');
                return;
            }
    
            await this.saveToFile(filteredProducts);
            console.log(`Producto ${id} eliminado exitosamente.`);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }

    async saveToFile(products) {
        try {
			const json = JSON.stringify(products, null, 2);
			await fs.writeFile(this.path, json);
		} catch (error) {
			console.log('Error al escribir el archivo: ', error);
		}
    }
}

export default ProductManager;