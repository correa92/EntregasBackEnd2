import mongoose from "mongoose";

class MongooseAdapter {
  async init(uri) {
    return (this.connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }));
  }

  async close() {
    const conection = await this.connection.disconnect();
    if (!conection) {
      throw new Error("Could not close the connection");
    }
    return conection;
  }

  async drop() {
    const conection = await this.connection.dropDatabase();
    if (!conection) {
      throw new Error("Could not delete the database");
    }
    return await this.connection.dropDatabase();
  }
}

export default MongooseAdapter;
