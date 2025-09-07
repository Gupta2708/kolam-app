// KolamARScene.js
// ViroReact fallback - this component is not used when ViroReact is unavailable
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function KolamARScene({ kolamData }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ViroReact AR not available</Text>
      <Text style={styles.subtext}>Using camera fallback instead</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 8 },
  subtext: { fontSize: 14, color: '#666' },
});

// To use ViroARScene, follow install steps in frontend/README.md
