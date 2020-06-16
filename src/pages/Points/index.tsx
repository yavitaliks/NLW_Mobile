import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from "../../services/conections";

interface itens {
  id: number;
  titulo: String;
  image_url: String;
}

const Points = () => {
  const navigation = useNavigation();
  const [itens, setItens] = useState<itens[]>([]);
  const [selectedItens, setSelectedItens] = useState<number[]>([]);

  function goToBack() {
    navigation.goBack();
  }

  function navigateToDetail() {
    navigation.navigate("Detail");
  }

  async function loadItens() {
    try {
      const itens = await api.get("/itens");
      setItens(itens.data);
    } catch (erro) {
      console.log(" ---------- ERRO API: ", erro);
    }
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItens.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filtredItems = selectedItens.filter((item) => item !== id);
      setSelectedItens(filtredItems);
    } else {
      setSelectedItens([...selectedItens, id]);
    }
  }

  useEffect(() => {
    loadItens();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={{}} onPress={goToBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 0.0799251,
              longitude: -51.0853921,
              latitudeDelta: 0.029,
              longitudeDelta: 0.029,
            }}
          >
            <Marker
              onPress={navigateToDetail}
              style={styles.mapMarker}
              coordinate={{
                latitude: 0.082478,
                longitude: -51.088586,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{
                    uri:
                      "https://s.marketwatch.com/public/resources/images/MW-ER558_consum_ZH_20160714154123.jpg",
                  }}
                />
                <Text style={styles.mapMarkerTitle}>Mercado</Text>
              </View>
            </Marker>
          </MapView>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {itens.map((iten) => (
            <TouchableOpacity
              key={String(iten.id)}
              style={[
                styles.item,
                selectedItens.includes(iten.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(iten.id)}
            >
              <SvgUri uri={iten.image_url} />
              <Text style={styles.itemTitle}>{iten.titulo}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default Points;

// Estilos

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});
