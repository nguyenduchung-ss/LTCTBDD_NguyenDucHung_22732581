import * as SQLite from 'expo-sqlite';

export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
  cloudId?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    this.db = await SQLite.openDatabaseAsync('tasks.db');
    await this.createTables();
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        cloudId TEXT
      );
    `);
  }

  async addTask(title: string): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      'INSERT INTO tasks (title, completed, createdAt, updatedAt, synced) VALUES (?, ?, ?, ?, ?)',
      title, 0, now, now, 0
    );

    return {
      id: result.lastInsertRowId,
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
      synced: false
    };
  }

  async getTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<any>('SELECT * FROM tasks ORDER BY createdAt DESC');
    
    return result.map(row => ({
      id: row.id,
      title: row.title,
      completed: row.completed === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      synced: row.synced === 1,
      cloudId: row.cloudId
    }));
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }
    if (updates.cloudId !== undefined) {
      fields.push('cloudId = ?');
      values.push(updates.cloudId);
    }
    if (updates.synced !== undefined) {
      fields.push('synced = ?');
      values.push(updates.synced ? 1 : 0);
    }

    fields.push('updatedAt = ?');
    values.push(now);

    values.push(id);

    await this.db.runAsync(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      ...values
    );
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM tasks WHERE id = ?', id);
  }

  async getUnsyncedTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<any>('SELECT * FROM tasks WHERE synced = 0');
    
    return result.map(row => ({
      id: row.id,
      title: row.title,
      completed: row.completed === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      synced: row.synced === 1,
      cloudId: row.cloudId
    }));
  }

  async markAsSynced(id: number, cloudId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync(
      'UPDATE tasks SET synced = 1, cloudId = ? WHERE id = ?',
      cloudId, id
    );
  }
}

export const database = new DatabaseService();