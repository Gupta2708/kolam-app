import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Button } from 'react-native';
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

  // ViroReact not available, use fallback
  useEffect(() => {
    setFallback(true);
  }, []);

  if (fallback) {
    if (hasPermission === null) return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
    if (hasPermission === false) return <View style={styles.center}><Text>No camera access</Text></View>;
    return (
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }} />
        <View style={styles.overlay} pointerEvents="none">
          {kolamData && <KolamCanvas dots={kolamData.dots} strokes={kolamData.strokes} animate={true} />}
        </View>
        <View style={styles.fallbackBanner}><Text>AR Fallback: Camera + SVG Overlay</Text></View>
      </View>
    );
  }

  // Viro AR
  return <KolamARScene kolamData={route.params?.kolamData} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  fallbackBanner: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff8', padding: 8, alignItems: 'center' },
});
