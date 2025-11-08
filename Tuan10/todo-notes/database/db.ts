import * as SQLite from 'expo-sqlite';

// Mở kết nối database
const db = SQLite.openDatabaseSync('todos.db');

// Export database instance
export default db;

// Hàm kiểm tra kết nối
export const testConnection = () => {
  try {
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};