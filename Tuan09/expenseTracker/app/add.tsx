import React, { useRef, useState } from 'react';
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
import { useRouter } from 'expo-router';
import { addTransaction } from '../database/db';

export default function AddScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Thu' | 'Chi'>('Chi');

  // useRef để clear input
  const titleInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);

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

    // Thêm vào database
    const result = addTransaction(title.trim(), Number(amount), type);

    if (result) {
      Alert.alert('Thành công', 'Đã thêm giao dịch mới', [
        {
          text: 'OK',
          onPress: () => {
            // Clear inputs using useRef
            setTitle('');
            setAmount('');
            titleInputRef.current?.clear();
            amountInputRef.current?.clear();
            
            // Quay lại màn hình chính
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không thể thêm giao dịch');
    }
  };

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
            <Text style={styles.headerTitle}>Thêm Giao Dịch</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
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
    backgroundColor: '#4CAF50',
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
});