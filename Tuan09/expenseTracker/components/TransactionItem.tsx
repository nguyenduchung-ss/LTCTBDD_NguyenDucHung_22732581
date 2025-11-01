import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface TransactionItemProps {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  type: 'Thu' | 'Chi';
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function TransactionItem({
  id,
  title,
  amount,
  createdAt,
  type,
  onPress,
  onLongPress,
}: TransactionItemProps) {
  const isIncome = type === 'Thu';

  // Format số tiền
  const formatAmount = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.typeBadge, isIncome ? styles.incomeBadge : styles.expenseBadge]}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}>
          {isIncome ? '+' : '-'}{formatAmount(amount)} đ
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  incomeBadge: {
    backgroundColor: '#E8F5E9',
  },
  expenseBadge: {
    backgroundColor: '#FFEBEE',
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#F44336',
  },
});