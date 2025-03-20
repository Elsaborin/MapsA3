import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 220;
const SPACING = 10;

export default function App() {
  const initialRegion = {
    latitude: 21.0500005,
    longitude: -86.8456237,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const [activeMarkerIndex, setActiveMarkerIndex] = useState(-1);
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  const pueblosMagicos = [
    {
      id: '1',
      title: 'Espita',
      description: 'Conocido por sus casonas coloniales y su rica tradición en la producción de henequén. Destaca su arquitectura francesa del siglo XIX.',
      coordinate: { latitude: 21.0094, longitude: -88.3047 },
      image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: '2',
      title: 'Tizimín',
      description: 'Ciudad de los Reyes Magos, famosa por su feria ganadera y el Santuario de los Tres Reyes. Centro importante de comercio en la región.',
      coordinate: { latitude: 21.1431, longitude: -88.1500 },
      image: 'https://images.unsplash.com/photo-1596423816927-76f5f4e2c67a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: '3',
      title: 'Tekax',
      description: 'La Sultana de la Sierra, con su impresionante zona arqueológica de Chacmultún y grutas misteriosas. Importante centro histórico de la región Puuc.',
      coordinate: { latitude: 20.2000, longitude: -89.2833 },
      image: 'https://images.unsplash.com/photo-1605217613423-0a61bd725c8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: '4',
      title: 'Motul',
      description: 'Cuna de los huevos motuleños y hogar del ex convento de San Juan Bautista. Ciudad con rica historia henequenera y gastronómica.',
      coordinate: { latitude: 21.0972, longitude: -89.2847 },
      image: 'https://images.unsplash.com/photo-1566419808810-658178380987?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ];

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  }, []);

  useEffect(() => {
    if (activeMarkerIndex === -1) return;

    const selectedPueblo = pueblosMagicos[activeMarkerIndex];

    mapRef.current?.animateToRegion({
      latitude: selectedPueblo.coordinate.latitude,
      longitude: selectedPueblo.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);

    scrollViewRef.current?.scrollTo({
      x: activeMarkerIndex * (CARD_WIDTH + SPACING),
      animated: true,
    });

  }, [activeMarkerIndex]);

  const handleCardScroll = (index) => {
    if (index !== activeMarkerIndex) {
      setActiveMarkerIndex(index);
    }
  };

  const handleMarkerPress = (index) => {
    setActiveMarkerIndex(index);
  };

  const navigateToCancun = () => {
    setActiveMarkerIndex(-1);
    mapRef.current?.animateToRegion(initialRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Marker
          key={`ut-marker-${activeMarkerIndex === -1}`}
          coordinate={initialRegion}
          title="UT Cancún"
          description="Universidad Tecnológica de Cancún"
          pinColor={activeMarkerIndex === -1 ? '#FF0000' : '#1E88E5'}
          onPress={navigateToCancun}
        />

        {pueblosMagicos.map((pueblo, index) => (
          <Marker
            key={`${pueblo.id}-${activeMarkerIndex}`}
            coordinate={pueblo.coordinate}
            title={pueblo.title}
            description={pueblo.description}
            pinColor={activeMarkerIndex === index ? '#FF0000' : '#3498db'}
            onPress={() => handleMarkerPress(index)}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.cancunButton} onPress={navigateToCancun}>
        <Text style={styles.cancunButtonText}>Volver a UT Cancún</Text>
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={CARD_WIDTH + SPACING}
          snapToAlignment="center"
          contentContainerStyle={styles.scrollViewContent}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
            handleCardScroll(index);
          }}
        >
          {pueblosMagicos.map((pueblo, index) => (
            <TouchableOpacity
              key={pueblo.id}
              activeOpacity={0.8}
              style={[
                styles.card,
                activeMarkerIndex === index && styles.activeCard
              ]}
              onPress={() => handleCardScroll(index)}
            >
              <Image source={{ uri: pueblo.image }} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{pueblo.title}</Text>
                <Text style={styles.cardDescription}>{pueblo.description}</Text>
                <TouchableOpacity
                  style={styles.navigateButton}
                  activeOpacity={0.6}
                  onPress={() => handleCardScroll(index)}
                >
                  <Text style={styles.navigateButtonText}>Ver en el mapa</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  cancunButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancunButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: width * 0.1,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: SPACING,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activeCard: {
    borderWidth: 3,
    borderColor: '#FF0000',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  navigateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});