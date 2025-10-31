
import { Expose } from 'class-transformer';

export class UserInfoResponse {

  @Expose({ name: "id" })
  id: string;

  @Expose({ name: "first_name" })
  firstName: string;

  @Expose({ name: "last_name" })
  lastName: string;

  @Expose({ name: "email" })
  email: string;

  constructor(id: string, firstName: string, lastName: string, email: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
