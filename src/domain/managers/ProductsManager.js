import ProductMongooseRepository from "../../data/repositories/mongoose/ProductMongooseRepository.js";

class ProductManager {
  constructor() {
    this.productRepository = new ProductMongooseRepository();
  }

  async find(limit, page, category, status, sort) {
    return this.productRepository.find(limit, page, category, status, sort);
  }

  async findOne(id) {
    return this.productRepository.findOne(id);
  }

  async create(data) {
    return await this.productRepository.create(data);
  }

  async updateOne(id, data) {
    return this.productRepository.updateOne(id, data);
  }

  async deleteOne(id) {
    return this.productRepository.deleteOne(id);
  }
}

export default ProductManager;
