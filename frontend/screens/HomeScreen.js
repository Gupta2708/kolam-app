import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/kolam1.jpg'),
  require('../assets/kolam2.jpg'),
  require('../assets/kolam3.jpg'),
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Choose an option to get started</Text>

      {/* Carousel Section */}
      <View style={{ height: 220, marginBottom: 24 }}>
        <Carousel
          loop
          width={width * 0.9}
          height={200}
          autoPlay
          data={images}
          scrollAnimationDuration={1500}
          renderItem={({ item }) => (
            <Image source={item} style={styles.carouselImage} />
          )}
        />
      </View>

      {/* Cards Section */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('KolamGenerator')}>
          <Icon name="color-palette-outline" size={32} color="#4f46e5" />
          <Text style={styles.cardText}>Kolam Generator</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AR')}>
          <Icon name="camera-outline" size={32} color="#4f46e5" />
          <Text style={styles.cardText}>AR View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 40, color: '#2c3e50' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 24 },
  carouselImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#2c3e50' },
});