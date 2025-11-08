import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllTodos } from '../database/db';

export default function HomeScreen() {
  const [todosCount, setTodosCount] = useState(0);

  useEffect(() => {
    loadTodosCount();
  }, []);

  const loadTodosCount = () => {
    const todos = getAllTodos();
    setTodosCount(todos.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Todo Notes</Text>
        <Text style={styles.headerSubtitle}>Quản lý công việc của bạn</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusIcon}>✅</Text>
          <Text style={styles.statusTitle}>Database Ready</Text>
          <Text style={styles.statusText}>Bảng "todos" đã được tạo thành công</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>📊</Text>
          <Text style={styles.infoTitle}>Thống kê</Text>
          <Text style={styles.infoCount}>{todosCount}</Text>
          <Text style={styles.infoLabel}>công việc</Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={loadTodosCount}>
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
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
    backgroundColor: '#6200EE',
    padding: 20,
    paddingTop: 30,
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#6200EE',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    opacity: 0.9,
  },
  infoCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  refreshButton: {
    backgroundColor: '#03DAC6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});