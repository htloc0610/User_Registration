
import { Expose } from 'class-transformer';

export class SignUpResponse {

  @Expose({ name: "id" })
  id: string;

  @Expose({ name: "first_name" })
  firstName: string;

  @Expose({ name: "last_name" })
  lastName: string;

  @Expose({ name: "email" })
  email: string;

  @Expose({ name: "created_at" })
  createdAt: Date;

  @Expose({ name: "updated_at" })
  updatedAt: Date;

  constructor(id: string, firstName: string, lastName: string, email: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
