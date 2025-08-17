// Pantalla del juego de preguntas (Verdadero / Falso)
import { usePoints } from '@/context/PointsContext';
import { QUESTIONS } from '@/data/quiz';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function QuizScreen() {
  const [index, setIndex] = useState(0); // Índice de la pregunta actual
  const [answers, setAnswers] = useState<boolean[]>([]); // Respuestas del usuario
  const { awardIfNotAwarded } = usePoints();

  const q = QUESTIONS[index]; // Pregunta actual
  const finished = answers.length === QUESTIONS.length; // ¿Ya respondió todas?
  const correctCount = answers.filter((a, i) => a === QUESTIONS[i].answer).length; // Total correctas

  // Cuando el quiz termina, otorgar puntos
  useEffect(() => {
    if (finished) awardIfNotAwarded('quiz');
  }, [finished]);

  // Registrar respuesta
  const onAnswer = (ans: boolean) => {
    if (finished) return;
    setAnswers(prev => [...prev, ans]);
    setIndex(prev => prev + 1);
  };

  // Reiniciar el juego
  const restart = () => {
    setIndex(0);
    setAnswers([]);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con título y botón reiniciar */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Verdadero / Falso (6)</Text>
        <Pressable onPress={restart} style={styles.reset}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Reiniciar</Text>
        </Pressable>
      </View>

      {/* Si aún no terminó el quiz */}
      {!finished ? (
        <View style={styles.card}>
          <Text style={styles.progress}>Pregunta {index + 1} / {QUESTIONS.length}</Text>
          <Text style={styles.question}>{q.prompt}</Text>
          <View style={styles.row}>
            <Pressable style={styles.btn} onPress={() => onAnswer(true)}>
              <Text style={styles.btnText}>Verdadero</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor: '#dc2626' }]} onPress={() => onAnswer(false)}>
              <Text style={styles.btnText}>Falso</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        // Si ya terminó, mostrar resultado
        <View style={styles.card}>
          <Text style={styles.result}>¡Completado! +10 puntos añadidos 🎉</Text>
          <Text style={styles.score}>Puntuación: {correctCount} / {QUESTIONS.length}</Text>
          <Pressable style={styles.btn} onPress={restart}>
            <Text style={styles.btnText}>Jugar de nuevo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220', padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: 'white', fontSize: 20, fontWeight: '800' },
  reset: { backgroundColor: '#1f2937', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 18, gap: 14 },
  progress: { color: '#93c5fd' },
  question: { color: 'white', fontSize: 18, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, backgroundColor: '#2563eb', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '800' },
  result: { color: '#86efac', fontWeight: '800', fontSize: 16 },
  score: { color: 'white' },
});
