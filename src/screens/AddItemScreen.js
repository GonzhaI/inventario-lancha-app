import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useInventory } from "../context/InventoryContext";

const AddItemScreen = ({ route, navigation }) => {
  const { reportId } = route.params; // Necesitamos saber a qué reporte agregarle cosas
  const { agregarItem, masterSecciones, masterItems } = useInventory();

  // Estados del formulario
  const [seccion, setSeccion] = useState("");
  const [nombreItem, setNombreItem] = useState("");
  const [cantidad, setCantidad] = useState("");

  const handleGuardar = async () => {
    if (!seccion.trim() || !nombreItem.trim() || !cantidad.trim()) {
      Alert.alert("Faltan datos", "Por favor completa todos los campos.");
      return;
    }

    await agregarItem(reportId, seccion, nombreItem, cantidad);

    // Limpiamos los campos de ítem y cantidad para agregar otro rápido en la misma sección
    setNombreItem("");
    setCantidad("");
    Alert.alert("Guardado", "Ítem agregado correctamente. Puedes agregar otro.", [{ text: "OK" }]);
    // O si prefieres que se salga al guardar, usa: navigation.goBack();
  };

  // Componente visual para las "Chips" de sugerencia
  const SuggestionList = ({ data, onSelect }) => (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      keyExtractor={(item) => item}
      style={styles.suggestionList}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.chip} onPress={() => onSelect(item)}>
          <Text style={styles.chipText}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. SELECCIÓN DE SECCIÓN */}
        <Text style={styles.label}>Sección / Ubicación:</Text>
        <TextInput style={styles.input} placeholder="Ej. Proa, Cabina..." value={seccion} onChangeText={setSeccion} />
        {masterSecciones.length > 0 && <SuggestionList data={masterSecciones} onSelect={setSeccion} />}

        {/* 2. NOMBRE DEL ÍTEM */}
        <Text style={styles.label}>Nombre del Producto:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Bengala, Cuerda..."
          value={nombreItem}
          onChangeText={setNombreItem}
        />
        {masterItems.length > 0 && <SuggestionList data={masterItems} onSelect={setNombreItem} />}

        {/* 3. CANTIDAD */}
        <Text style={styles.label}>Cantidad:</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
        />

        <View style={{ height: 20 }} />

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar Ítem</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  suggestionList: {
    marginTop: 8,
    maxHeight: 50,
  },
  chip: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  chipText: {
    color: "#2e7d32",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddItemScreen;
