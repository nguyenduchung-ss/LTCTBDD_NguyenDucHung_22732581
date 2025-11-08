import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';

interface TodoItemProps {
  id: number;
  title: string;
  done: number;
  created_at: number;
  onPress?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void; // ✅ thêm prop
}

export default function TodoItem({
  id,
  title,
  done,
  created_at,
  onPress,
  onLongPress,
  onDelete,
}: TodoItemProps) {
  const isDone = done === 1;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
  }, [done]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.container, isDone && styles.containerDone]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
            {isDone && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.date}>{formatDate(created_at)}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{isDone ? '✓' : '○'}</Text>
        </View>

        {/* ✅ Nút xoá */}
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  containerDone: { backgroundColor: '#f5f5f5', opacity: 0.8 },
  checkboxContainer: { marginRight: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#6200EE', borderColor: '#6200EE' },
  checkmark: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  contentContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  titleDone: { textDecorationLine: 'line-through', color: '#999' },
  date: { fontSize: 12, color: '#999' },
  statusBadge: { marginLeft: 8 },
  statusText: { fontSize: 20, color: '#6200EE' },
  deleteButton: {
    marginLeft: 8,
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deleteText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
