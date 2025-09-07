import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const presets = ['1-19-1', '1-29-1', '1-109-1'];

export default function DotGridSelector({ value, onChange }) {
  const [custom, setCustom] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dot Grid:</Text>
      <View style={styles.presetRow}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[styles.presetBtn, value === preset && styles.selected]}
            onPress={() => { onChange(preset); setCustom(''); }}
          >
            <Text>{preset}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Custom (e.g. 1-19-1)"
        value={custom}
        onChangeText={txt => { setCustom(txt); onChange(txt); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: { marginBottom: 4 },
  presetRow: { flexDirection: 'row', marginBottom: 8 },
  presetBtn: { padding: 8, borderWidth: 1, borderColor: '#aaa', borderRadius: 6, marginRight: 8 },
  selected: { backgroundColor: '#e0e0e0' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
});
