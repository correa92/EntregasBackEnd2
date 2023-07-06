import { v4 } from "uuid";
import CartMongooseRepository from "../../data/repositories/mongoose/CartMongooseRepository.js";
import ProductMongooseRepository from "../../data/repositories/mongoose/ProductMongooseRepository.js";
import TicketMongooseRepository from "../../data/repositories/mongoose/TicketMongooseRepository.js";
class CartManager {
  constructor() {
    this.cartRepository = new CartMongooseRepository();
    this.productRepository = new ProductMongooseRepository();
    this.ticketRepository = new TicketMongooseRepository();
  }

  async getOne(id) {
    return this.cartRepository.getOne(id);
  }

  async create(data) {
    return await this.cartRepository.create(data);
  }

  async buyCar(id, email) {
    let cart = await this.cartRepository.getCart(id);

    if (cart.id === undefined) {
      return { Error: "Cart id not found" };
    }

    let total = 0;
    for (const e of cart.products) {
      const product = await this.productRepository.findOne(e.idProduct._id);

      if (e.quantity <= product.stock) {
        total += product.price * e.quantity;
        await this.productRepository.updateStock(e.idProduct._id, e.quantity);
        await this.cartRepository.deleteOfCart(cart.id, e.idProduct._id);
      }
    }
    const ticket = {
      code: v4(),
      amount: total,
      purchase: email,
    };
    return await this.ticketRepository.createTicket(ticket);
  }

  async addToCart(cid, pid) {
    try {
      const cart = await this.cartRepository.getCart(cid);
      const product = await this.productRepository.findOne(pid);
      if (cart.id === undefined) {
        return { Error: "Cart id not found" };
      }

      if (product.Error) {
        return { Error: "Product id not found" };
      }

      const productsInCart = cart.products.map((p) => p.idProduct.toString());

      productsInCart.forEach((prod, index) => {
        if (prod === pid) {
          cart.products[index].quantity += 1;
        }
      });

      if (!productsInCart.includes(pid)) {
        cart.products.push({ idProduct: pid, quantity: 1 });
      }

      return this.cartRepository.updateCart(cid, cart);
    } catch (error) {
      return { Error: error.message };
    }
  }

  async removeProductFromCart(cid, pid) {
    const cart = await this.cartRepository.getCart(cid);
    const newListProducts = cart.products.filter(
      (prod) => prod.idProduct.toString() !== pid
    );

    cart.products = newListProducts;

    return this.cartRepository.updateCart(cid, cart);
  }

  async removeAllProductFromCart(cid) {
    return this.cartRepository.updateCart(cid, { products: [] });
  }

  async addListProducts(cid, data) {
    const cart = await this.cartRepository.getOne(cid);

    cart.products = data;

    return this.cartRepository.updateCart(cid, cart);
  }
}
export default CartManager;
