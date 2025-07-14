import { Pool } from 'pg';
import { IStorage } from './storage.js';

export class PostgresStorage implements IStorage {
  private pool: Pool;
  private isConnected = false;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  async connect() {
    if (this.isConnected) return;
    
    try {
      await this.pool.connect();
      console.log('✅ Connected to PostgreSQL database');
      
      // Create tables if they don't exist
      await this.createTables();
      this.isConnected = true;
    } catch (error) {
      console.error('❌ PostgreSQL connection error:', error);
      throw error;
    }
  }

  private async createTables() {
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workspaces (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        platform VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        scheduled_for TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS social_accounts (
        id SERIAL PRIMARY KEY,
        workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        username VARCHAR(255) NOT NULL,
        access_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS waitlist_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        early_access BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.pool.query(createTablesQuery);
    console.log('✅ PostgreSQL tables created/verified');
  }

  async disconnect() {
    if (this.isConnected) {
      await this.pool.end();
      this.isConnected = false;
      console.log('🔌 Disconnected from PostgreSQL database');
    }
  }

  // Mock implementations for development
  async createUser(userData: any) {
    const { username, email, password } = userData;
    const query = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
    const result = await this.pool.query(query, [username, email, password]);
    return result.rows[0];
  }

  async getUserByEmail(email: string) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async getUserById(id: string) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async createWorkspace(workspaceData: any) {
    const { name, userId } = workspaceData;
    const query = 'INSERT INTO workspaces (name, user_id) VALUES ($1, $2) RETURNING *';
    const result = await this.pool.query(query, [name, userId]);
    return result.rows[0];
  }

  async getWorkspacesByUserId(userId: string) {
    const query = 'SELECT * FROM workspaces WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async getScheduledContent() {
    const query = 'SELECT * FROM content WHERE status = $1 AND scheduled_for <= NOW()';
    const result = await this.pool.query(query, ['scheduled']);
    return result.rows;
  }

  async getAllSocialAccounts() {
    const query = 'SELECT * FROM social_accounts';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async createContent(contentData: any) {
    const { workspaceId, title, body, platform, status, scheduledFor } = contentData;
    const query = `INSERT INTO content (workspace_id, title, body, platform, status, scheduled_for) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await this.pool.query(query, [workspaceId, title, body, platform, status, scheduledFor]);
    return result.rows[0];
  }

  async isUserOnWaitlist(email: string) {
    const query = 'SELECT * FROM waitlist_users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async addToWaitlist(email: string) {
    const query = 'INSERT INTO waitlist_users (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *';
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  }

  // Cleanup methods for development
  async clearAllUsers() {
    const result = await this.pool.query('DELETE FROM users');
    return result.rowCount || 0;
  }

  async clearAllWorkspaces() {
    const result = await this.pool.query('DELETE FROM workspaces');
    return result.rowCount || 0;
  }

  async clearAllContent() {
    const result = await this.pool.query('DELETE FROM content');
    return result.rowCount || 0;
  }

  async clearAllSocialAccounts() {
    const result = await this.pool.query('DELETE FROM social_accounts');
    return result.rowCount || 0;
  }

  async clearAllWaitlistUsers() {
    const result = await this.pool.query('DELETE FROM waitlist_users');
    return result.rowCount || 0;
  }
}