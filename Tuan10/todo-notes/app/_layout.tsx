import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { testConnection } from '../database/db';

export default function RootLayout() {
  useEffect(() => {
    // Test database connection khi app start
    testConnection();
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