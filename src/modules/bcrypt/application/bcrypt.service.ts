import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {

  async createHash (password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, 10);

    return passwordHash
  }

  comparePassword (args: { password: string, hash: string }): Promise<boolean> {
    return bcrypt.compare(args.password, args.hash);
  }
}
