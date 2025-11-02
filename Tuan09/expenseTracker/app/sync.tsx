import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getAllTransactions } from '../database/db';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  type: string;
  isDeleted?: number;
}

export default function SyncScreen() {
  const router = useRouter();
  const [apiUrl, setApiUrl] = useState('');
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    // Validate URL
    if (!apiUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL API');
      return;
    }

    // Kiểm tra URL có đúng format không
    if (!apiUrl.includes('mockapi.io') && !apiUrl.includes('http')) {
      Alert.alert('Lỗi', 'URL không hợp lệ. Vui lòng nhập URL từ MockAPI.io');
      return;
    }

    setSyncing(true);

    try {
      // Bước 1: Lấy tất cả data từ SQLite
      const localTransactions = getAllTransactions() as Transaction[];
      console.log('Local transactions:', localTransactions.length);

      // Bước 2: Lấy tất cả data từ API
      const getResponse = await axios.get(apiUrl);
      const apiTransactions = getResponse.data;
      console.log('API transactions before delete:', apiTransactions.length);

      // Bước 3: Xóa tất cả data trên API
      for (const item of apiTransactions) {
        await axios.delete(`${apiUrl}/${item.id}`);
      }
      console.log('Deleted all API transactions');

      // Bước 4: Upload tất cả data từ SQLite lên API
      let uploadedCount = 0;
      for (const transaction of localTransactions) {
        const dataToUpload = {
          title: transaction.title,
          amount: transaction.amount,
          createdAt: transaction.createdAt,
          type: transaction.type,
        };
        
        await axios.post(apiUrl, dataToUpload);
        uploadedCount++;
      }

      console.log('Uploaded transactions:', uploadedCount);

      setSyncing(false);
      Alert.alert(
        '✅ Đồng bộ thành công',
        `Đã đồng bộ ${uploadedCount} giao dịch lên API`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      setSyncing(false);
      console.error('Sync error:', error);
      Alert.alert(
        '❌ Lỗi đồng bộ',
        error.response?.data?.message || error.message || 'Không thể kết nối đến API'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đồng Bộ API</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📌 Hướng dẫn:</Text>
            <Text style={styles.infoText}>
              1. Truy cập https://mockapi.io{'\n'}
              2. Tạo project mới{'\n'}
              3. Tạo resource với tên "transactions"{'\n'}
              4. Thêm các field: title (string), amount (number), createdAt (string), type (string){'\n'}
              5. Copy URL API và paste vào ô bên dưới{'\n'}
              6. Nhấn "Đồng bộ ngay"
            </Text>
          </View>

          {/* API URL Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>URL API MockAPI *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://[id].mockapi.io/api/v1/transactions"
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>
              VD: https://6789abc.mockapi.io/api/v1/transactions
            </Text>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Lưu ý: Tất cả dữ liệu cũ trên API sẽ bị xóa và được thay thế bằng dữ liệu từ thiết bị này.
            </Text>
          </View>

          {/* Sync Button */}
          <TouchableOpacity
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <View style={styles.syncingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.syncButtonText}>  Đang đồng bộ...</Text>
              </View>
            ) : (
              <Text style={styles.syncButtonText}>🔄 Đồng bộ ngay</Text>
            )}
          </TouchableOpacity>

          {/* Info Steps */}
          <View style={styles.stepsBox}>
            <Text style={styles.stepsTitle}>Quá trình đồng bộ:</Text>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Lấy dữ liệu từ SQLite</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Xóa toàn bộ dữ liệu trên API</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Upload dữ liệu mới lên API</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>Hoàn tất đồng bộ</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#9C27B0',
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
  content: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#E1F5FE',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#01579B',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    lineHeight: 20,
  },
  syncButton: {
    backgroundColor: '#9C27B0',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  syncButtonDisabled: {
    backgroundColor: '#CE93D8',
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepsBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#9C27B0',
    borderRadius: 14,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
});