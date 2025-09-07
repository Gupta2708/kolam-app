import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Kolam App!</Text>
      <Button title="Generate Kolam" onPress={() => navigation.navigate('KolamGenerator')} />
      <View style={{ height: 16 }} />
      <Button title="AR View" onPress={() => navigation.navigate('AR')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 32, textAlign: 'center' },
});
