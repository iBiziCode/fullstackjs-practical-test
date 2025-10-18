import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as path from 'path';

@Injectable()
export class DbService implements OnModuleInit {
  private db: Database<sqlite3.Database, sqlite3.Statement>;
  private readonly logger = new Logger(DbService.name);

  async onModuleInit() {
    try{

      const dbPath = path.resolve(process.cwd(), 'users.db');
      this.db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      this.logger.log('✅ Database connected, preparing tables...');
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE COLLATE NOCASE,
          role TEXT,
          status TEXT DEFAULT 'inactive',
          createdAt TEXT
        );
      `);
  
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS user_crypto (
          userId TEXT,
          signature TEXT,
          FOREIGN KEY(userId) REFERENCES users(id)
        );
      `);

      this.logger.log('✅ Database connected and tables ensured.');
    } catch (error) {
      this.logger.error('❌ Error initializing database:', error);
    }
  }

  get connection() {
    return this.db;
  }
}
