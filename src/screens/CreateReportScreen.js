import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { useInventory } from "../context/InventoryContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CreateReportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [nombreLancha, setNombreLancha] = useState("");
  const { crearReporte, masterLanchas } = useInventory();

  const handleGuardar = async () => {
    if (nombreLancha.trim() === "") {
      Alert.alert("Error", "Por favor escribe el nombre de la lancha");
      return;
    }

    // Creamos el reporte en el Contexto
    const nuevoId = await crearReporte(nombreLancha);

    // Volvemos atrás (luego cambiaremos esto para ir directo a agregar ítems)
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, paddingRigh: insets.right }]}>
      <Text style={styles.label}>Nombre de la Lancha:</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. La Poderosa II"
        value={nombreLancha}
        onChangeText={setNombreLancha}
      />

      {/* LISTA DE SUGERENCIAS (Historial) */}
      {masterLanchas.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.subTitle}>Usadas anteriormente:</Text>
          <FlatList
            data={masterLanchas}
            keyExtractor={(item) => item}
            horizontal={true} // Lista horizontal para ahorrar espacio
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.chip} onPress={() => setNombreLancha(item)}>
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Comenzar Inspección</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 20,
  },
  suggestionsContainer: {
    marginBottom: 20,
    height: 80, // Altura fija para la zona de sugerencias
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#006064",
  },
  chipText: {
    color: "#006064",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto", // Empuja el botón al final si hay espacio
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateReportScreen;
