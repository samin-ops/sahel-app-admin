export class RegisterDto {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    phone: string,
    email: string,
    password: string,
    password_confirmation: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.password_confirmation = password_confirmation;
    this.username = username;
    this.phone = phone;
    this.email = email;
    this.password = password;
  }
}
