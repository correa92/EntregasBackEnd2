class Product {
  constructor(props) {
    this._id = props._id
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.price = props.price;
    this.thumbnail = props.thumbnail;
    this.code = props.code;
    this.stock = props.stock;
    this.category = props.category;
    this.status = props.status;
  }
}

export default Product;
