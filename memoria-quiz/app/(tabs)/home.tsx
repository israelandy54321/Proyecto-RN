// Pantalla principal de inicio
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { usePoints } from '@/context/PointsContext';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { totalPoints, resetPoints } = usePoints(); // Contexto de puntos
  const { signOut, user } = useAuth(); // Contexto de autenticación

  return (
    <View style={styles.container}>
      {/* Mensaje de bienvenida */}
      <Text style={styles.greet}>¡BIENVENIDO{user?.email ? `, ${user.email}` : ''}! 👋</Text>
      
      {/* Puntos totales */}
      <Text style={styles.points}>TOTAL DE PUNTOS: {totalPoints}</Text>

      {/* Opciones de juegos */}
      <View style={styles.row}>
        <Link href="/(tabs)/memory" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardText}>MEMORIA 6x6</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/quiz" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardText}>¿CUÁNTO SABES? (6)</Text>
          </Pressable>
        </Link>
      </View>

      <View style={{ height: 20 }} />

      {/* Botón para reiniciar puntos */}
      <Pressable style={styles.secondary} onPress={resetPoints}>
        <Text style={styles.secondaryText}>REINICIAR PUNTOS</Text>
      </Pressable>

      {/* Botón para cerrar sesión */}
      <Pressable style={styles.logout} onPress={signOut}>
        <Text style={styles.secondaryText}>CERRAR SESIÓN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0b1220' },
  greet: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 10 },
  points: { color: '#93c5fd', fontSize: 18, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  card: { 
    flex: 1, 
    backgroundColor: '#1f2937', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cardText: { color: 'white', fontWeight: '700' },
  secondary: { 
    backgroundColor: '#111827', 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  logout: { 
    backgroundColor: '#dc2626', 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  secondaryText: { color: 'white', fontWeight: '700' }
});
