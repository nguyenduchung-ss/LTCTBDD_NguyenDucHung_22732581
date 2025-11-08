import * as SQLite from 'expo-sqlite';

// Mở kết nối database
const db = SQLite.openDatabaseSync('todos.db');

// Khởi tạo database
export const initDatabase = () => {
  try {
    // Tạo bảng todos nếu chưa có
    db.execSync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);
    
    console.log('✅ Table "todos" created successfully');
    
    // Kiểm tra xem bảng có dữ liệu chưa
    const count = db.getFirstSync('SELECT COUNT(*) as count FROM todos');
    const totalRecords = (count as any).count;
    
    console.log(`📊 Current todos count: ${totalRecords}`);
    
    // Seed data nếu bảng trống
    if (totalRecords === 0) {
      seedData();
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

// Seed dữ liệu mẫu
const seedData = () => {
  try {
    const now = Date.now();
    
    db.runSync(
      'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
      ['Học React Native', 0, now]
    );
    
    db.runSync(
      'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
      ['Hoàn thành bài tập', 0, now + 1000]
    );
    
    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

// Lấy tất cả todos
export const getAllTodos = () => {
  try {
    const result = db.getAllSync('SELECT * FROM todos ORDER BY created_at DESC');
    return result;
  } catch (error) {
    console.error('Error getting todos:', error);
    return [];
  }
};

// Thêm todo mới
export const addTodo = (title: string) => {
  try {
    const created_at = Date.now();
    const result = db.runSync(
      'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
      [title, 0, created_at]
    );
    console.log('✅ Todo added successfully:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Error adding todo:', error);
    return null;
  }
};

// Export database instance
export default db;