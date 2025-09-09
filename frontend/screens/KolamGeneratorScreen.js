import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DotGridSelector from '../components/DotGridSelector';
import KolamCanvas from '../components/KolamCanvas';
import { generateKolam } from '../utils/api';

export default function KolamGeneratorScreen() {
  const [gridSize, setGridSize] = useState('1-19-1');
  const [kolamData, setKolamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setKolamData(null);
    setAnimate(false);
    try {
      const data = await generateKolam(gridSize);
      setKolamData(data);
      setTimeout(() => setAnimate(true), 500);
    } catch (e) {
      Alert.alert('Error', 'Failed to generate kolam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#ffe29f', '#ffa99f']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🎨 Kolam Generator</Text>
        <DotGridSelector value={gridSize} onChange={setGridSize} />

        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator style={{ margin: 24 }} size="large" color="#ff9f68" />}

        {kolamData && (
          <View style={styles.canvasContainer}>
            <KolamCanvas dots={kolamData.dots} strokes={kolamData.strokes} animate={animate} />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  button: {
    backgroundColor: '#ff9f68',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  canvasContainer: { marginTop: 24, width: '100%', alignItems: 'center' },
});
