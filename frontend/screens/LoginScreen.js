import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LinearGradient
      colors={['#ffe29f', '#ffa99f']}
      style={styles.container}
    >
    <View style={styles.header}>
      <Image
        source={require('../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>KolamVision!</Text>
      <Text style={styles.subtitle}>AI-powered Kolam patterns at your fingertips</Text>
    </View>

    <View style={styles.form}>
      <View style={styles.inputWrapper}>
        <Icon name="mail-outline" size={20} color="#ff9f68" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="lock-closed-outline" size={20} color="#ff9f68" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Home')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert('Forgot Password?')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.signupContainer}>
      <Text style={styles.signupText}>Don’t have an account?</Text>
      <TouchableOpacity onPress={() => alert('Navigate to Sign Up')}>
        <Text style={styles.signupLink}> Sign Up</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 100, height: 100, marginBottom: 10, borderRadius: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#555', marginTop: 4 },
  form: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 18,
    padding: 22,
    elevation: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: '#333' },
  button: {
    backgroundColor: '#ff9f68',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  forgot: { color: '#ff9f68', fontSize: 14, textAlign: 'center', marginTop: 16 },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signupText: { fontSize: 14, color: '#444' },
  signupLink: { fontSize: 14, fontWeight: 'bold', color: '#ff9f68' },
});
