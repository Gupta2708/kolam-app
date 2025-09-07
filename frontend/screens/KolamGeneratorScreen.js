import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
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
      setTimeout(() => setAnimate(true), 500); // Start animation after render
    } catch (e) {
      Alert.alert('Error', 'Failed to generate kolam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kolam Generator</Text>
      <DotGridSelector value={gridSize} onChange={setGridSize} />
      <Button title="Generate" onPress={handleGenerate} />
      {loading && <ActivityIndicator style={{ margin: 24 }} />}
      {kolamData && (
        <View style={styles.canvasContainer}>
          <KolamCanvas dots={kolamData.dots} strokes={kolamData.strokes} animate={animate} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 16 },
  canvasContainer: { marginTop: 24, width: '100%', alignItems: 'center' },
});
