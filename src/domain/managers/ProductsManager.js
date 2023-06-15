import ProductMongooseDao from "../../data/dao/ProductMongooseDao.js";

class ProductManager {
  constructor() {
    this.productDao = new ProductMongooseDao();
  }

  async find(limit, page, category, status, sort) {
    return this.productDao.find(limit, page, category, status, sort);
  }

  async findOne(id) {
    return this.productDao.findOne(id);
  }

  async create(data) {
    return await this.productDao.create(data);
  }

  async updateOne(id, data) {
    return this.productDao.updateOne(id, data);
  }

  async deleteOne(id) {
    return this.productDao.deleteOne(id);
  }
}

export default ProductManager;
