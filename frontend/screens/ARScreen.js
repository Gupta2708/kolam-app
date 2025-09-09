import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KolamARScene from './KolamARScene';
import { Camera } from 'expo-camera';
import KolamCanvas from '../components/KolamCanvas';
import { generateKolam } from '../utils/api';

export default function ARScreen({ route }) {
  const [fallback, setFallback] = useState(false);
  const [kolamData, setKolamData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      if (fallback) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (!kolamData) {
          const data = await generateKolam('1-19-1');
          setKolamData(data);
        }
      }
    })();
  }, [fallback]);

  useEffect(() => {
    setFallback(true);
  }, []);

  if (fallback) {
    if (hasPermission === null) return <View style={styles.center}><Text style={styles.text}>Requesting camera permission...</Text></View>;
    if (hasPermission === false) return <View style={styles.center}><Text style={styles.text}>No camera access</Text></View>;

    return (
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }} />
        <View style={styles.overlay} pointerEvents="none">
          {kolamData && <KolamCanvas dots={kolamData.dots} strokes={kolamData.strokes} animate={true} />}
        </View>
        <View style={styles.fallbackBanner}>
          <Text style={styles.bannerText}>AR Fallback: Camera + SVG Overlay</Text>
        </View>
      </View>
    );
  }

  return <KolamARScene kolamData={route.params?.kolamData} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  text: { fontSize: 16, color: '#2c3e50' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  fallbackBanner: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#4f46e5cc', padding: 12, alignItems: 'center' },
  bannerText: { color: '#fff', fontWeight: 'bold' },
});
