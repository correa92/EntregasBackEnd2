class Role {
  constructor(props) {
    this.id = props?.id.toString();
    this.name = props?.name;
    this.permissions = props?.permissions;
  }
}

export default Role;
