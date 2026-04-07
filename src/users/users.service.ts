import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  findOne(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  create(user: User): User {
    this.users.push(user);
    return user;
  }

  findById(userId: number): User | undefined {
    return this.users.find((user) => user.id === userId);
  }
}
