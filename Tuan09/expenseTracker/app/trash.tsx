import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import TransactionItem from '../components/TransactionItem';
import { getDeletedTransactions, restoreTransaction, searchDeletedTransactions } from '../database/db';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  type: 'Thu' | 'Chi';
}

export default function TrashScreen() {
  const router = useRouter();
  const [deletedTransactions, setDeletedTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Reload khi focus vào màn hình
  useFocusEffect(
    React.useCallback(() => {
      loadDeletedTransactions();
    }, [])
  );

  // Search khi searchQuery thay đổi
  useEffect(() => {
    loadDeletedTransactions();
  }, [searchQuery]);

  const loadDeletedTransactions = () => {
    if (searchQuery.trim()) {
      const data = searchDeletedTransactions(searchQuery.trim());
      setDeletedTransactions(data as Transaction[]);
    } else {
      const data = getDeletedTransactions();
      setDeletedTransactions(data as Transaction[]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDeletedTransactions();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleItemLongPress = (id: number) => {
    Alert.alert(
      '🔄 Khôi phục giao dịch',
      'Giao dịch sẽ được chuyển về danh sách chính. Bạn có muốn khôi phục?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Khôi phục',
          style: 'default',
          onPress: () => {
            const success = restoreTransaction(id);
            if (success) {
              Alert.alert('✅ Thành công', 'Đã khôi phục giao dịch về danh sách chính');
              loadDeletedTransactions();
            } else {
              Alert.alert('❌ Lỗi', 'Không thể khôi phục giao dịch');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F44336" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thùng Rác</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🔄 Chạm giữ vào giao dịch để khôi phục
        </Text>
        <Text style={styles.infoSubText}>
          Giao dịch sẽ được chuyển về danh sách chính
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm trong thùng rác..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Deleted Transactions List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Kết quả tìm kiếm (${deletedTransactions.length})` : `Giao dịch đã xóa (${deletedTransactions.length})`}
        </Text>
        
        <FlatList
          data={deletedTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <TransactionItem
                id={item.id}
                title={item.title}
                amount={item.amount}
                createdAt={item.createdAt}
                type={item.type}
                onLongPress={() => handleItemLongPress(item.id)}
              />
              <View style={styles.deletedBadge}>
                <Text style={styles.deletedBadgeText}>Đã xóa</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#F44336']}
              tintColor="#F44336"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🗑️</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Thùng rác trống'}
              </Text>
              <Text style={styles.emptySubText}>
                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Các giao dịch đã xóa sẽ xuất hiện ở đây'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F44336',
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 70,
  },
  infoBox: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  infoText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  infoSubText: {
    color: '#C62828',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  itemWrapper: {
    position: 'relative',
  },
  deletedBadge: {
    position: 'absolute',
    top: 10,
    right: 25,
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deletedBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});