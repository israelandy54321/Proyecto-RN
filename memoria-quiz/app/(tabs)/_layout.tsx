import { useAuth } from '@/context/AuthContext';
import { Tabs, Redirect } from 'expo-router';
import React from 'react';


export default function TabsLayout() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/" />;

  return (
    <Tabs screenOptions={{ headerTitleStyle: { fontWeight: '800' } }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="memory" options={{ title: 'Memory 6x6' }} />
      <Tabs.Screen name="quiz" options={{ title: 'True/False' }} />
    </Tabs>
  );
}
