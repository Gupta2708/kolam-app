import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/kolam1.jpg'),
  require('../assets/kolam2.jpg'),
  require('../assets/kolam3.jpg'),
];

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
    colors={['#ffe29f', '#ffa99f']}
    style={styles.container}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Image
            source={require('../assets/user.jpg')}
            style={styles.userIcon}
          />
        </TouchableOpacity>

        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="notifications-outline" size={26} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="ellipsis-vertical" size={26} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome!👋</Text>
      <Text style={styles.subtitle}>Choose an option to get started</Text>

      {/* Carousel Section */}
      <View style={{ height: 340, marginBottom: 24 }}>
        <Carousel
          loop
          width={width * 0.9}
          height={330}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  userIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#af8809ff', // gold border
  },
  topIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 18 },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1e293b', // dark navy
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#475569', // muted gray-blue
    marginBottom: 28, 
    textAlign: 'center',
  },

  carouselImage: {
    width: '100%',
    height: 330,
    borderRadius: 20,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  cardContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,

  },
  cardText: { 
    marginTop: 12, 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#2c3e50' 
  },
});
