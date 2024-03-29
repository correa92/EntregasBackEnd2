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
      throw new Error("Cart id not found");
    }

    if (cart.products.length === 0) {
      throw new Error("Empty cart");
    }

    let total = 0;
    let products = [];
    for (const p of cart.products) {
      const product = await this.productRepository.findOne(p.idProduct);

      if (p.quantity <= product.stock) {
        const subtotal = product.price * p.quantity;
        total += subtotal;
        const prod = await this.productRepository.updateStock(
          p.idProduct,
          p.quantity
        );
        products.push({
          product: prod.title,
          quantity: p.quantity,
          subtotal: subtotal,
          thumbnail: product.thumbnail[0],
        });
        await this.cartRepository.deleteOfCart(cart.id, p.idProduct);
      } else {
        throw new Error(
          "The selected quantity cannot exceed the current stock"
        );
      }
    }
    const ticket = {
      code: v4(),
      amount: total,
      purchase: email,
      list: products,
    };

    return await this.ticketRepository.createTicket(ticket);
  }

  async addToCart(cid, pid) {
    const cart = await this.cartRepository.getCart(cid);
    const product = await this.productRepository.findOne(pid);

    if (cart.id === undefined) {
      throw new Error("Cart id not found");
    }

    if (product.id === undefined) {
      throw new Error("Product id not found");
    }

    const productsInCart = cart.products.map((p) => p.idProduct.toString());

    productsInCart.forEach((prod, index) => {
      if (prod === pid && cart.products[index].quantity <= product.stock) {
        cart.products[index].quantity += 1;
      }
    });

    if (!productsInCart.includes(pid)) {
      cart.products.push({ idProduct: pid, quantity: 1 });
    }

    return this.cartRepository.updateCart(cid, cart);
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
    if (data.length === 0) {
      throw new Error("Without new products");
    }
    const products = [];

    for (const p of data) {
      const prod = await this.productRepository.findOne(p.idProduct);
      if (!prod) {
        throw new Error(
          `The product with the id ${p.idProduct} does not found`
        );
      }
      if (prod.stock < p.quantity) {
        throw new Error(
          `the product with the id ${p.idProduct} does not have enough stock`
        );
      }
      products.push(p);
    }

    return this.cartRepository.updateCart(cid, { products });
  }

  async updateQuantity(cid, pid, body) {
    const cart = await this.cartRepository.getCart(cid);
    const product = await this.productRepository.findOne(pid);

    if (cart.id === undefined) {
      throw new Error("Cart id not found");
    }

    if (product.id === undefined) {
      throw new Error("Product id not found");
    }

    if (!body.quantity || body.quantity < 0) {
      throw new Error("you must enter an amount");
    }
    const productsInCart = cart.products.map((p) => p.idProduct.toString());

    productsInCart.forEach((prod, index) => {
      if (prod === pid && cart.products[index].quantity <= product.stock) {
        cart.products[index].quantity += body.quantity;
      }
    });

    if (!productsInCart.includes(pid)) {
      cart.products.push({ idProduct: pid, quantity: body.quantity });
    }

    return this.cartRepository.updateCart(cid, cart);
  }
  async deleteCart(cid) {
    const cart = await this.cartRepository.getCart(cid);

    if (cart.id === undefined) {
      throw new Error("Cart id not found");
    }
  }
}

export default CartManager;
