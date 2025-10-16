import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from '../database/db.service';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import { getKeys } from './crypto.util';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}

  private keys = getKeys();

  async create(createUserDto: CreateUserDto) {
    const { email, role, status } = createUserDto;
    const id = uuid();
    const createdAt = new Date().toISOString();

    await this.db.connection.run(
      'INSERT INTO users (id, email, role, status, createdAt) VALUES (?, ?, ?, ?, ?)',
      [id, email, role, status, createdAt],
    );

    const hash = crypto.createHash('sha256').update(email).digest('hex');
    const signature = crypto
      .sign('sha384', Buffer.from(hash), this.keys.privateKey)
      .toString('base64');
    await this.db.connection.run(
      `INSERT INTO user_crypto (userId, hash, signature)
       VALUES (?, ?, ?)`,
      [id, hash, signature],
    );

    return { id, email, role, status, createdAt};
  }

  findAll() {
    return this.db.connection.all(`
      SELECT u.*, c.signature
      FROM users u
      LEFT JOIN user_crypto c ON c.userId = u.id
    `);
  }

  findOne(id: string) {
    return this.db.connection.get(
      `
      SELECT u.*, c.signature
      FROM users u
      LEFT JOIN user_crypto c ON c.userId = u.id
      WHERE u.id = ?
      `,
      [id],
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) return null;
    const {
      email = user.email,
      role = user.role,
      status = user.status,
    } = updateUserDto;

    await this.db.connection.run(
      `UPDATE users SET email=?, role=?, status=? WHERE id=?`,
      [email, role, status, id],
    );
    return { id, email, role, status, createdAt: user.createdAt };
  }

  remove(id: string) {
    return this.db.connection.run(
      `DELETE FROM users WHERE id=?`,
      [id],
    );
  }
}
