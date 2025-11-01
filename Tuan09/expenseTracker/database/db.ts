import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('expenseTracker.db');

// Khởi tạo database
export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        createdAt TEXT NOT NULL,
        type TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Lấy tất cả giao dịch
export const getAllTransactions = () => {
  try {
    const result = db.getAllSync('SELECT * FROM transactions WHERE isDeleted = 0 ORDER BY createdAt DESC');
    return result;
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

// Thêm giao dịch mới
export const addTransaction = (title: string, amount: number, type: string) => {
  try {
    const createdAt = new Date().toISOString();
    const result = db.runSync(
      'INSERT INTO transactions (title, amount, createdAt, type, isDeleted) VALUES (?, ?, ?, ?, 0)',
      [title, amount, createdAt, type]
    );
    console.log('Transaction added successfully:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
};

// Cập nhật giao dịch
export const updateTransaction = (id: number, title: string, amount: number, type: string) => {
  try {
    const result = db.runSync(
      'UPDATE transactions SET title = ?, amount = ?, type = ? WHERE id = ?',
      [title, amount, type, id]
    );
    console.log('Transaction updated successfully');
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating transaction:', error);
    return false;
  }
};

// Xóa giao dịch (soft delete)
export const deleteTransaction = (id: number) => {
  try {
    const result = db.runSync(
      'UPDATE transactions SET isDeleted = 1 WHERE id = ?',
      [id]
    );
    console.log('Transaction deleted successfully');
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

// Lấy giao dịch đã xóa
export const getDeletedTransactions = () => {
  try {
    const result = db.getAllSync('SELECT * FROM transactions WHERE isDeleted = 1 ORDER BY createdAt DESC');
    return result;
  } catch (error) {
    console.error('Error getting deleted transactions:', error);
    return [];
  }
};

// Khôi phục giao dịch
// Khôi phục giao dịch
export const restoreTransaction = (id: number) => {
  try {
    const result = db.runSync(
      'UPDATE transactions SET isDeleted = 0 WHERE id = ?',
      [id]
    );
    console.log('Transaction restored successfully');
    return result.changes > 0;
  } catch (error) {
    console.error('Error restoring transaction:', error);
    return false;
  }
};
// Tìm kiếm giao dịch
export const searchTransactions = (keyword: string) => {
  try {
    const result = db.getAllSync(
      'SELECT * FROM transactions WHERE isDeleted = 0 AND title LIKE ? ORDER BY createdAt DESC',
      [`%${keyword}%`]
    );
    return result;
  } catch (error) {
    console.error('Error searching transactions:', error);
    return [];
  }
};

// Tìm kiếm giao dịch đã xóa
export const searchDeletedTransactions = (keyword: string) => {
  try {
    const result = db.getAllSync(
      'SELECT * FROM transactions WHERE isDeleted = 1 AND title LIKE ? ORDER BY createdAt DESC',
      [`%${keyword}%`]
    );
    return result;
  } catch (error) {
    console.error('Error searching deleted transactions:', error);
    return [];
  }
};

export default db;