import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { database } from '../services/database';

export default function RootLayout() {
  useEffect(() => {
    // Khởi tạo database khi app start
    database.init().then(() => {
      console.log('Database initialized');
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="tasks" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="add-task" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}