import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from '../database/db.service';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import { getKeys } from './crypto.util';
import { subDays, format, eachDayOfInterval } from 'date-fns';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}
  private readonly logger = new Logger(UserService.name);
  private keys = getKeys();

  async create(createUserDto: CreateUserDto) {
    const { email, role, status } = createUserDto;
    const id = uuid();
    const createdAt = new Date().toISOString();
    const connection = this.db.connection;
    try {
      await connection.run('BEGIN TRANSACTION');
      await connection.run(
        'INSERT INTO users (id, email, role, status, createdAt) VALUES (?, ?, ?, ?, ?)',
        [id, email, role, status, createdAt],
      );

      const hash = crypto.createHash('sha256').update(email).digest('hex');
      const signature = crypto
        .sign('sha384', Buffer.from(hash), this.keys.privateKey)
        .toString('base64');

      await connection.run(
        `INSERT INTO user_crypto (userId, hash, signature)
         VALUES (?, ?, ?)`,
        [id, hash, signature],
      );

      await connection.run('COMMIT');
      this.logger.log(`✅ Created user: { ${email} ${role} ${status} }`);
      return { id, email, role, status, createdAt, signature };
    } catch (error) {
      await connection.run('ROLLBACK');

      if (error.message.includes('UNIQUE constraint failed: users.email')) {
        this.logger.warn(`⚠️ Duplicate email attempted: ${email}`);
        throw new ConflictException(`Email "${email}" is already registered`);
      }

      this.logger.error('❌ Error creating user:', error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    try{
      const users = await this.db.connection.all(`
          SELECT u.*, c.signature
          FROM users u
          LEFT JOIN user_crypto c ON c.userId = u.id
        `);
        
      this.logger.log(`✅ Fetched ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('❌ Error fetching users:', error.stack);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.db.connection.get(
        `
        SELECT u.*, c.signature
        FROM users u
        LEFT JOIN user_crypto c ON c.userId = u.id
        WHERE u.id = ?
      `,
        [id],
      );
      if (!user) throw new NotFoundException(`❌ User with ID "${id}" not found`);

      this.logger.log(`✅ Fetched user: ${id}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`⚠️ User with ID "${id}" not found`);
        throw error;
      }
      this.logger.error('❌ Error fetching user:', error.stack);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {

      const user = await this.findOne(id);
      
      const {
        email = user.email,
        role = user.role,
        status = user.status,
      } = updateUserDto;
  
      await this.db.connection.run(
        `UPDATE users SET email=?, role=?, status=? WHERE id=?`,
        [email, role, status, id],
      );
      this.logger.log(`✅ Updated user: ${id}`);
      return { id, email, role, status, createdAt: user.createdAt };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`⚠️ User with ID "${id}" not found`);
        throw error;
      }
      if (error.message.includes('UNIQUE constraint failed: users.email')) {
        this.logger.warn(`⚠️ Duplicate email attempted: ${updateUserDto.email}`);
        throw new ConflictException(`Email "${updateUserDto.email}" is already registered`);
      }
      this.logger.error('❌ Error updating user:', error.stack);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try{

      await this.findOne(id);
      const connection = await this.db.connection;
      await connection.run('BEGIN TRANSACTION');
      await connection.run(`DELETE FROM user_crypto WHERE userId = ?`, [id]);
      await connection.run(`DELETE FROM users WHERE id = ?`, [id]);
      await connection.run('COMMIT');
      this.logger.log(`✅ Removed user: ${id}`);  
    } catch (error) {
        if (error instanceof NotFoundException) {
      this.logger.warn(`⚠️ User with ID "${id}" not found`);
      throw error;
    }
      this.logger.error('❌ Error removing user:', error.stack);
      throw new InternalServerErrorException('Failed to remove user');
    }
  }
  
  async getStats(){
    
    try {
      const stats = await this.db.connection.all(`
        SELECT 
          DATE(createdAt) as date, 
          COUNT(*) as count 
        FROM users 
        WHERE createdAt >= DATE('now', '-6 days')
        GROUP BY DATE(createdAt)
        ORDER BY DATE(createdAt) DESC
      `);
      const today = new Date();
      const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
      }).map(date => format(date, 'yyyy-MM-dd'));

      const counts = last7Days.map(date => {
        const stat = stats.find(s => s.date === date);
        return { date, count: stat ? stat.count : 0 };
      });

      this.logger.log(`✅ Fetched user registration counts for the last 7 days`);
      return counts;
    } catch (error) {
      this.logger.error('❌ Error fetching user registration counts:', error.stack);
      throw new InternalServerErrorException('Failed to fetch user registration counts');
    }
  }

  getPublicKey(): string {
    try {
      return this.keys.publicKey.export({ type: 'spki', format: 'pem' }).toString();
    } catch (error) {
      this.logger.error('❌ Failed to export public key', error.stack);
      throw new InternalServerErrorException('Failed to export public key');
    }
  }

}
