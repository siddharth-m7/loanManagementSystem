import User, { type IUser } from '../models/User.js';
import { BaseRepository } from './BaseRepository.js';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email });
  }
}
