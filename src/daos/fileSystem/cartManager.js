const fs = require('fs');

class CartManager {
    constructor() {
        this.path = "./mockDB/cart.json";
        this.cart = [];
        this.loadCart();
    }

    async loadCart() {
        try {
          const cartInJson = await fs.promises.readFile(this.path, "utf-8");
          this.cart = JSON.parse(cartInJson);
        } catch (error) {
          console.error("Error loading cart:", error);
        }
    }

    async writeCartToFile() {
        try {
          const cartJson = JSON.stringify(this.cart, null, 2);
          await fs.promises.writeFile(this.path, cartJson);
        } catch (error) {
          console.error("Error writing cart to file:", error);
        }
    }

    async createCart() {
        try{
            let id = 0;
            for (let i = 0; i < this.cart.length; i++) {
                const element = this.cart[i];
                if(element.id > id){
                    id = element.id;
                }
            }
            id++;

            const newCart = {
                id: id,
                products: []
            }
            this.cart.push(newCart)
            await this.writeCartToFile()
            return newCart;

        } catch(error){
            console.error(error)
            throw new Error("Error creating cart")
        }
    }

    async getCarts(){
        return this.cart
    }

    async getCartById(id) {
        const index = this.cart.findIndex((cart) => cart.id === parseInt(id));
        const cart = this.cart[index];
    
        if (index !== -1) {
          return { cart }; 
        } else {
          console.log("This cart does not exist");
          return { cart: { products: [] } }; 
        }
    }

    async addProductToCart(cartId, productId) {
        try {
          const { index, cart } = await this.getCartById(cartId);
    
          if (index === -1) {
            console.log("Cart not found");
            return;
          }
    
          const existingProductIndex = cart.products.findIndex((item) => item.product === parseInt(productId));
    
          if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
          } else {
            cart.products.push({
              product: productId,
              quantity: 1,
            });
          }
    
          await this.writeCartToFile();
    
          console.log("Product added to cart successfully");
        } catch (error) {
          console.error(error);
        }
      }
}

module.exports = CartManager;
