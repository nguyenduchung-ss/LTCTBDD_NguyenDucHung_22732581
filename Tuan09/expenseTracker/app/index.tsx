import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionItem from '../components/TransactionItem';

// Dữ liệu mẫu để test
const SAMPLE_DATA = [
  {
    id: 1,
    title: 'Lương tháng 10',
    amount: 15000000,
    createdAt: '2024-10-01T08:00:00',
    type: 'Thu' as const,
  },
  {
    id: 2,
    title: 'Mua đồ ăn',
    amount: 150000,
    createdAt: '2024-10-05T12:30:00',
    type: 'Chi' as const,
  },
  {
    id: 3,
    title: 'Tiền thưởng',
    amount: 5000000,
    createdAt: '2024-10-10T14:00:00',
    type: 'Thu' as const,
  },
  {
    id: 4,
    title: 'Tiền điện nước',
    amount: 500000,
    createdAt: '2024-10-15T09:00:00',
    type: 'Chi' as const,
  },
  {
    id: 5,
    title: 'Mua xăng',
    amount: 300000,
    createdAt: '2024-10-20T16:45:00',
    type: 'Chi' as const,
  },
];

export default function HomeScreen() {
  const [transactions, setTransactions] = useState(SAMPLE_DATA);

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
    console.log('Pressed item:', id);
    // Sẽ navigate sang màn hình chi tiết ở câu 4
  };

  const handleItemLongPress = (id: number) => {
    console.log('Long pressed item:', id);
    // Sẽ xử lý xóa ở câu 5
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

      {/* Transaction List */}
      <View style={styles.transactionListContainer}>
        <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
        
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
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
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
  transactionListContainer: {
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
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});