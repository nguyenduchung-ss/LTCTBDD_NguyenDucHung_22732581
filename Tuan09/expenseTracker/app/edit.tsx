import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { updateTransaction } from '../database/db';
import db from '../database/db';

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const transactionId = Number(params.id);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Thu' | 'Chi'>('Chi');
  const [loading, setLoading] = useState(true);

  // useRef để clear input
  const titleInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);

  // Load dữ liệu giao dịch khi màn hình được mở
  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = () => {
  try {
    const result: any = db.getFirstSync(
      'SELECT * FROM transactions WHERE id = ? AND isDeleted = 0',
      [transactionId]
    );

    if (result) {
      setTitle(result.title);
      setAmount(String(result.amount));
      setType(result.type);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy giao dịch', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  } catch (error) {
    console.error('Error loading transaction:', error);
    Alert.alert('Lỗi', 'Không thể tải dữ liệu');
  } finally {
    setLoading(false);
  }
};

  const handleSave = () => {
    // Validate
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên giao dịch');
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    // Cập nhật vào database
    const result = updateTransaction(transactionId, title.trim(), Number(amount), type);

    if (result) {
      Alert.alert('Thành công', 'Đã cập nhật giao dịch', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật giao dịch');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Quay lại</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sửa Giao Dịch</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Type Selection */}
            <Text style={styles.label}>Loại giao dịch</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Thu' && styles.typeButtonActive]}
                onPress={() => setType('Thu')}
              >
                <Text style={[styles.typeButtonText, type === 'Thu' && styles.typeButtonTextActive]}>
                  Thu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Chi' && styles.typeButtonActive]}
                onPress={() => setType('Chi')}
              >
                <Text style={[styles.typeButtonText, type === 'Chi' && styles.typeButtonTextActive]}>
                  Chi
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <Text style={styles.label}>Tên giao dịch *</Text>
            <TextInput
              ref={titleInputRef}
              style={styles.input}
              placeholder="VD: Mua đồ ăn, Lương tháng..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />

            {/* Amount Input */}
            <Text style={styles.label}>Số tiền *</Text>
            <View style={styles.amountContainer}>
              <TextInput
                ref={amountInputRef}
                style={styles.amountInput}
                placeholder="0"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.currency}>đ</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>💾 Save</Text>
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>💡 Nhấn "Save" để lưu thay đổi</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF9800',
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingRight: 15,
  },
  amountInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FF9800',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoText: {
    color: '#E65100',
    fontSize: 14,
  },
});