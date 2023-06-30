import CartMongooseDao from "../../data/dao/CartMongooseDao.js";
import ProductMongooseDao from "../../data/dao/ProductMongooseDao.js";

class CartManager {
  constructor() {
    this.cartDao = new CartMongooseDao();
    this.productDao = new ProductMongooseDao();
  }

  async getOne(id) {
    return this.cartDao.getOne(id);
  }

  async create(data) {
    return await this.cartDao.create(data);
  }

  async buyCar(id) {
    const cart = await this.cartDao.getCart(id);

    if (cart.id === undefined) {
      return { Error: "Cart id not found" };
    }

    let productsInStock = [];
    let productsOutOfStock = [];

    for (const e of cart.products) {
      const product = await this.productDao.findOne(e.idProduct._id);

      if (e.quantity <= product.stock) {
        productsInStock.push(product);
      } else {
        productsOutOfStock.push(product);
      }
    }
    
    for (const e of productsInStock) {
      await this.productDao.updateStock(e.id,e.stock);
    }


    return productsInStock;
  }

  async addToCart(cid, pid) {
    try {
      const cart = await this.cartDao.getCart(cid);
      const product = await this.productDao.findOne(pid);
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

      return this.cartDao.updateCart(cid, cart);
    } catch (error) {
      return { Error: error.message };
    }
  }

  async removeProductFromCart(cid, pid) {
    const cart = await this.cartDao.getCart(cid);
    const newListProducts = cart.products.filter(
      (prod) => prod.idProduct.toString() !== pid
    );

    cart.products = newListProducts;

    return this.cartDao.updateCart(cid, cart);
  }

  async removeAllProductFromCart(cid) {
    return this.cartDao.updateCart(cid, { products: [] });
  }

  async addListProducts(cid, data) {
    const cart = await this.cartDao.getOne(cid);

    cart.products = data;

    return this.cartDao.updateCart(cid, cart);
  }
}
export default CartManager;
