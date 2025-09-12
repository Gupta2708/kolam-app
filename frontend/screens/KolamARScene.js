import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function KolamARScene({ kolamData }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ViroReact AR Not Available</Text>
      <Text style={styles.subtitle}>Using camera fallback instead</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7f8c8d' },
});
