import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../database/db';

export default function RootLayout() {
  useEffect(() => {
    // Khởi tạo database khi app start
    const success = initDatabase();
    if (success) {
      console.log('🎉 Database initialized and ready');
    } else {
      console.error('💥 Failed to initialize database');
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}