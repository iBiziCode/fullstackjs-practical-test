import { Injectable, OnModuleInit } from '@nestjs/common';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as path from 'path';

@Injectable()
export class DbService implements OnModuleInit {
  private db: Database<sqlite3.Database, sqlite3.Statement>;

  async onModuleInit() {
    const dbPath = path.resolve(process.cwd(), 'users.db');
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT,
        role TEXT,
        status TEXT,
        createdAt TEXT
      );
    `);

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_crypto (
        userId TEXT,
        hash TEXT,
        signature TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
    `);

    console.log('Database connected and tables ensured.');
  }

  get connection() {
    return this.db;
  }
}
