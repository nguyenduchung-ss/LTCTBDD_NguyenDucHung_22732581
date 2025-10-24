import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { database } from '../services/database';

export default function AddTaskScreen() {
  const [taskTitle, setTaskTitle] = useState('');

  const handleFinish = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await database.addTask(taskTitle);
      Alert.alert('Success', 'Task added successfully!');
      router.back();
    } catch (error) {
      console.error('Failed to add task:', error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>T</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Hi Twinkle</Text>
            <Text style={styles.subGreeting}>Have aгеате day a head</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>ADD YOUR JOB</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📄</Text>
          <TextInput
            style={styles.input}
            placeholder="input your job"
            placeholderTextColor="#999"
            value={taskTitle}
            onChangeText={setTaskTitle}
            multiline
          />
        </View>

        <TouchableOpacity 
          style={styles.finishButton}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <Text style={styles.finishButtonText}>FINISH →</Text>
        </TouchableOpacity>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.notepad}>
            <View style={styles.notepadLines}>
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
            </View>
          </View>
          <View style={styles.pencil}>
            <View style={styles.pencilBody} />
            <View style={styles.pencilTip} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 20,
    padding: 5,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subGreeting: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 30,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    minHeight: 40,
  },
  finishButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notepad: {
    width: 180,
    height: 220,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    padding: 20,
    transform: [{ rotate: '-5deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notepadLines: {
    flex: 1,
    justifyContent: 'space-around',
  },
  line: {
    height: 2,
    backgroundColor: '#F9A825',
    marginVertical: 8,
  },
  pencil: {
    position: 'absolute',
    right: 60,
    bottom: 80,
    transform: [{ rotate: '45deg' }],
  },
  pencilBody: {
    width: 80,
    height: 12,
    backgroundColor: '#E53935',
    borderRadius: 6,
  },
  pencilTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD54F',
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    right: -8,
    top: -2,
  },
});