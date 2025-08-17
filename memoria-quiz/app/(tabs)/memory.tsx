// Pantalla del juego de Memoria 6x6
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { usePoints } from '../../context/PointsContext';
import { PLACEHOLDER_IMAGES } from '../../data/memoryImages';

// Definición del tipo de carta
export type CardItem = { id: string; image: string; matched: boolean };

// Construir el mazo de cartas con pares de imágenes
function buildDeck(): CardItem[] {
  const images = PLACEHOLDER_IMAGES.slice(0, 18); // 18 imágenes únicas
  const deck = [...images, ...images].map((img, idx) => ({
    id: `${idx}-${img}`,
    image: img,
    matched: false,
  }));

  // Mezclar el mazo (algoritmo Fisher–Yates)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryScreen() {
  const [deck, setDeck] = useState<CardItem[]>(buildDeck()); // Estado del mazo
  const [flipped, setFlipped] = useState<number[]>([]); // Cartas volteadas
  const [locked, setLocked] = useState(false); // Bloqueo temporal mientras se comparan
  const { awardIfNotAwarded } = usePoints(); // Puntos

  // Verificar si todas las cartas fueron encontradas
  const allMatched = useMemo(() => deck.every(c => c.matched), [deck]);

  // Si todas fueron encontradas, otorgar puntos
  useEffect(() => {
    if (allMatched) {
      awardIfNotAwarded('memory');
    }
  }, [allMatched]);

  // Manejar cuando se presiona una carta
  const onCardPress = (index: number) => {
    if (locked) return;
    if (deck[index].matched) return;
    if (flipped.includes(index)) return;

    const next = [...flipped, index];
    setFlipped(next);

    // Si hay dos cartas volteadas, verificar coincidencia
     if (next.length === 2) {
      setLocked(true);
      const [i1, i2] = next;
      const c1 = deck[i1];
      const c2 = deck[i2];
      if (c1.image === c2.image) {
        // Si coinciden → marcarlas como encontradas (esperar 5s antes de limpiar)
        const updated = deck.map((c, idx) =>
          idx === i1 || idx === i2 ? { ...c, matched: true } : c
        );
        setTimeout(() => {
          setDeck(updated);
          setFlipped([]);
          setLocked(false);
        }, 5000); // 5 segundos
      } else {
        // Si no coinciden → voltearlas de nuevo después de 5s
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 5000); // 5 segundos
      }
    }
  };

  // Reiniciar el juego
  const reset = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setLocked(false);
  };

  // Renderizar cada carta
  const renderCard = ({ item, index }: { item: CardItem; index: number }) => {
    const isFaceUp = item.matched || flipped.includes(index);
    return (
      <Pressable
        style={[styles.card, isFaceUp && styles.cardUp]}
        onPress={() => onCardPress(index)}
      >
        {isFaceUp ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <Text style={styles.backText}>?</Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con título y botón de reinicio */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Memoria 6x6</Text>
        <Pressable onPress={reset} style={styles.reset}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Reiniciar</Text>
        </Pressable>
      </View>

      {/* Tablero de cartas */}
      <FlatList
        data={deck}
        keyExtractor={(it) => it.id}
        numColumns={6}
        renderItem={renderCard}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />

      {/* Mensaje al ganar */}
      {allMatched && (
        <Text style={styles.winText}>¡Completado! +10 puntos añadidos 🎉</Text>
      )}
    </View>
  );
}

const CARD_SIZE = 52;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220', padding: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: 'white', fontSize: 20, fontWeight: '800' },
  reset: { backgroundColor: '#1f2937', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  grid: { gap: 6, alignItems: 'center' },
  card: { width: CARD_SIZE, height: CARD_SIZE, margin: 3, backgroundColor: '#1f2937', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardUp: { backgroundColor: '#111827' },
  backText: { color: 'white', fontWeight: '800', fontSize: 18 },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  winText: { color: '#86efac', textAlign: 'center', marginTop: 10, fontWeight: '700' },
});
