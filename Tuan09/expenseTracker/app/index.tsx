import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import TransactionItem from '../components/TransactionItem';
import { initDatabase, getAllTransactions, deleteTransaction, searchTransactions } from '../database/db';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  type: 'Thu' | 'Chi';
}

export default function HomeScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Khởi tạo database khi app chạy
  useEffect(() => {
    initDatabase();
    loadTransactions();
  }, []);

  // Reload khi quay lại màn hình
  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  // Search khi searchQuery thay đổi
  useEffect(() => {
    loadTransactions();
  }, [searchQuery]);

  const loadTransactions = () => {
    if (searchQuery.trim()) {
      const data = searchTransactions(searchQuery.trim());
      setTransactions(data as Transaction[]);
    } else {
      const data = getAllTransactions();
      setTransactions(data as Transaction[]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Tính toán tổng thu, tổng chi
  const calculateSummary = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(item => {
      if (item.type === 'Thu') {
        totalIncome += item.amount;
      } else {
        totalExpense += item.amount;
      }
    });

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  };

  const summary = calculateSummary();

  const formatAmount = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleItemPress = (id: number) => {
    // Navigate sang màn hình edit với id
    router.push({
      pathname: '/edit',
      params: { id: id.toString() }
    });
  };

  const handleItemLongPress = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa giao dịch này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const success = deleteTransaction(id);
            if (success) {
              Alert.alert('Thành công', 'Đã xóa giao dịch');
              loadTransactions();
            } else {
              Alert.alert('Lỗi', 'Không thể xóa giao dịch');
            }
          },
        },
      ]
    );
  };

  const handleAddPress = () => {
    router.push('/add');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXPENSE TRACKER</Text>
        <Text style={styles.headerSubtitle}>Quản lý thu chi cá nhân</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng Thu</Text>
          <Text style={[styles.summaryAmount, styles.incomeText]}>
            {formatAmount(summary.income)} đ
          </Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng Chi</Text>
          <Text style={[styles.summaryAmount, styles.expenseText]}>
            {formatAmount(summary.expense)} đ
          </Text>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
        <Text style={styles.balanceAmount}>
          {formatAmount(summary.balance)} đ
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm giao dịch..."
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

      {/* Transaction List */}
<View style={styles.transactionListContainer}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>
      {searchQuery ? `Kết quả tìm kiếm (${transactions.length})` : 'Giao dịch gần đây'}
    </Text>
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={styles.syncButton} onPress={() => router.push('/sync')}>
        <Text style={styles.syncButtonText}>🔄</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.trashButton} onPress={() => router.push('/trash')}>
        <Text style={styles.trashButtonText}>🗑️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>+ Add</Text>
      </TouchableOpacity>
    </View>
  </View>
        
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransactionItem
              id={item.id}
              title={item.title}
              amount={item.amount}
              createdAt={item.createdAt}
              type={item.type}
              onPress={() => handleItemPress(item.id)}
              onLongPress={() => handleItemLongPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có giao dịch nào'}
            </Text>
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
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  balanceCard: {
    backgroundColor: '#2196F3',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
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
  transactionListContainer: {
    flex: 1,
    paddingTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  trashButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trashButtonText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
  syncButton: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  syncButtonText: {
    fontSize: 16,
  },
});