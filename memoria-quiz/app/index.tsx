// Pantalla de inicio de sesión
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState(''); // Estado para el correo
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const { signIn } = useAuth();
  const router = useRouter();

  // Manejar el inicio de sesión
  const onLogin = async () => {
    if (email.trim() && password.trim()) {
      await signIn({ email });
      router.replace('/(tabs)/home'); // Redirigir a la pantalla principal
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Inicia sesión para comenzar a jugar</Text>

      {/* Campos de entrada */}
      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#64748b"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#64748b"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Botón de inicio de sesión */}
      <Pressable style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>

      {/* Nota de ayuda */}
      <Text style={styles.hint}>* Este login de demostración acepta cualquier correo y contraseña.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 32, fontWeight: '800', color: 'white', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#cbd5e1', marginBottom: 24 },
  input: { 
    width: '100%', 
    backgroundColor: '#111827', 
    color: 'white', 
    borderRadius: 14, 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#374151' 
  },
  button: { 
    width: '100%', 
    backgroundColor: '#2563eb', 
    paddingVertical: 14, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 4 
  },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  hint: { color: '#94a3b8', marginTop: 12, fontSize: 12, textAlign: 'center' },
});
