export class User {
  constructor(param: any = {}) {
    this.id = param.id;
    this.firstName = param.firstName;
    this.lastName = param.lastName;
    this.username = param.username;
    this.phone = param.phone;
    this.password = param.password;
    this.password_confirmation = param.password_confirmation;
    this.email = param.email;
    this.roles = param.roles;
  }
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  password_confirmation: string;
  email: string;
  roles: Role;
  address!: string;
  address2!: string;
  country!: string;
  city!: string;
  zipCode!: string;
  token!: string;
}

export class UserDetail {
  $key!: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailId: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  zip: number;
}

export class Role {
  id: number;
  name: string;
  description: string;
}
