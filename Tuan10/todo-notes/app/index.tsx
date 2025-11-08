// index.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllTodos, addTodo, toggleTodoDone, updateTodo, deleteTodo } from '../database/db';
import TodoItem from '../components/TodoItem';
import AddTodoModal from '../components/AddTodoModal';

interface Todo {
  id: number;
  title: string;
  done: number;
  created_at: number;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // edit mode
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingInitialTitle, setEditingInitialTitle] = useState<string>('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = () => {
    setLoading(true);
    try {
      const data = getAllTodos();
      setTodos(data as Todo[]);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = (title: string) => {
    const result = addTodo(title);
    if (result) {
      Alert.alert('Thành công', 'Đã thêm công việc mới', [
        { text: 'OK', onPress: () => loadTodos() },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không thể thêm công việc');
    }
  };

  const handleItemPress = (id: number) => {
    const currentTodo = todos.find(todo => todo.id === id);
    if (!currentTodo) return;

    const success = toggleTodoDone(id, currentTodo.done);
    if (success) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, done: todo.done === 1 ? 0 : 1 } : todo
        )
      );
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const handleItemLongPress = (id: number) => {
    const currentTodo = todos.find(t => t.id === id);
    if (!currentTodo) return;

    setEditMode('edit');
    setEditingId(id);
    setEditingInitialTitle(currentTodo.title);
    setModalVisible(true);
  };

  const handleEditSubmit = (newTitle: string) => {
    if (editingId == null) {
      Alert.alert('Lỗi', 'Không tìm thấy mục để cập nhật');
      return;
    }

    const success = updateTodo(editingId, newTitle);
    if (success) {
      setTodos(prev =>
        prev.map(t => (t.id === editingId ? { ...t, title: newTitle } : t))
      );
      Alert.alert('Thành công', 'Đã cập nhật công việc', [{ text: 'OK' }]);
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật công việc');
    }

    setEditingId(null);
    setEditingInitialTitle('');
    setEditMode('add');
  };

  // ✅ Câu 7: Xóa todo có xác nhận
  const handleDeleteTodo = (id: number) => {
    const currentTodo = todos.find(t => t.id === id);
    if (!currentTodo) return;

    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc muốn xoá công việc "${currentTodo.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Đồng ý',
          style: 'destructive',
          onPress: () => {
            const success = deleteTodo(id);
            if (success) {
              setTodos(prev => prev.filter(t => t.id !== id));
              Alert.alert('Đã xoá', 'Công việc đã được xoá thành công');
            } else {
              Alert.alert('Lỗi', 'Không thể xoá công việc');
            }
          },
        },
      ]
    );
  };

  // Thống kê
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.done === 1).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Todo Notes</Text>
        <Text style={styles.headerSubtitle}>Quản lý công việc của bạn</Text>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalTodos}</Text>
          <Text style={styles.statLabel}>Tổng</Text>
        </View>
        <View style={[styles.statCard, styles.statCardPending]}>
          <Text style={styles.statNumber}>{pendingTodos}</Text>
          <Text style={styles.statLabel}>Chưa xong</Text>
        </View>
        <View style={[styles.statCard, styles.statCardDone]}>
          <Text style={styles.statNumber}>{completedTodos}</Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
      </View>

      {/* Todo List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Danh sách công việc</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditMode('add');
              setEditingId(null);
              setEditingInitialTitle('');
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoRow}>
              <TodoItem
                id={item.id}
                title={item.title}
                done={item.done}
                created_at={item.created_at}
                onPress={() => handleItemPress(item.id)}
                onLongPress={() => handleItemLongPress(item.id)}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTodo(item.id)}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>Chưa có việc nào</Text>
              <Text style={styles.emptyText}>
                Nhấn nút "+" để thêm công việc mới
              </Text>
            </View>
          }
        />
      </View>

      {/* Add/Edit Modal */}
      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={(title) => {
          handleAddTodo(title);
          setModalVisible(false);
        }}
        mode={editMode}
        initialTitle={editingInitialTitle}
        onEdit={(newTitle) => {
          handleEditSubmit(newTitle);
          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 25,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#6200EE',
  },
  statCardPending: { borderLeftColor: '#FF9800' },
  statCardDone: { borderLeftColor: '#4CAF50' },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#03DAC6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  listContent: {
    paddingBottom: 20,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    paddingRight: 16,
  },
  deleteText: {
    fontSize: 20,
    color: '#E53935',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
