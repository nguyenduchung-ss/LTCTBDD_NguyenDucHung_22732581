import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAllTodos,
  addTodo,
  toggleTodoDone,
  updateTodo,
  deleteTodo,
} from '../database/db';
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

  // ✅ Thêm state cho search
  const [searchText, setSearchText] = useState('');

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

  const handleAddTodo = useCallback((title: string) => {
    const result = addTodo(title);
    if (result) {
      Alert.alert('Thành công', 'Đã thêm công việc mới', [
        { text: 'OK', onPress: () => loadTodos() },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không thể thêm công việc');
    }
  }, []);

  const handleItemPress = useCallback(
    (id: number) => {
      const currentTodo = todos.find((todo) => todo.id === id);
      if (!currentTodo) return;

      const success = toggleTodoDone(id, currentTodo.done);

      if (success) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, done: todo.done === 1 ? 0 : 1 } : todo
          )
        );
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
      }
    },
    [todos]
  );

  const handleItemLongPress = useCallback(
    (id: number) => {
      const currentTodo = todos.find((t) => t.id === id);
      if (!currentTodo) return;

      setEditMode('edit');
      setEditingId(id);
      setEditingInitialTitle(currentTodo.title);
      setModalVisible(true);
    },
    [todos]
  );

  const handleEditSubmit = useCallback(
    (newTitle: string) => {
      if (editingId == null) {
        Alert.alert('Lỗi', 'Không tìm thấy mục để cập nhật');
        return;
      }

      const success = updateTodo(editingId, newTitle);
      if (success) {
        setTodos((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, title: newTitle } : t))
        );
        Alert.alert('Thành công', 'Đã cập nhật công việc', [
          { text: 'OK', onPress: () => {} },
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật công việc');
      }

      setEditingId(null);
      setEditingInitialTitle('');
      setEditMode('add');
    },
    [editingId]
  );

  const handleDeleteTodo = useCallback((id: number) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa công việc này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const success = deleteTodo(id);
          if (success) {
            setTodos((prev) => prev.filter((t) => t.id !== id));
          } else {
            Alert.alert('Lỗi', 'Không thể xóa công việc');
          }
        },
      },
    ]);
  }, []);

  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.done === 1).length;
  const pendingTodos = totalTodos - completedTodos;

  // ✅ Dùng useMemo để tránh render thừa khi lọc
  const filteredTodos = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(lowerSearch)
    );
  }, [todos, searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Todo Notes</Text>
        <Text style={styles.headerSubtitle}>Quản lý công việc của bạn</Text>
      </View>

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

        {/* ✅ Ô tìm kiếm real-time */}
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm công việc..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />

        <FlatList
          data={filteredTodos} // ✅ hiển thị danh sách đã lọc
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoItem
              id={item.id}
              title={item.title}
              done={item.done}
              created_at={item.created_at}
              onPress={() => handleItemPress(item.id)}
              onLongPress={() => handleItemLongPress(item.id)}
              onDelete={() => handleDeleteTodo(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>Không có công việc</Text>
              <Text style={styles.emptyText}>
                Gõ để tìm hoặc thêm công việc mới
              </Text>
            </View>
          }
        />
      </View>

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
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
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
  statsContainer: { flexDirection: 'row', padding: 16, gap: 12 },
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
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: '#666' },
  listContainer: { flex: 1 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addButton: {
    backgroundColor: '#03DAC6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listContent: { paddingBottom: 20 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: { fontSize: 80, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center' },
});
