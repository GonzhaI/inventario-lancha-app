import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useInventory } from "../context/InventoryContext";

const HomeScreen = ({ navigation }) => {
  const { reportes } = useInventory();

  // Función para renderizar cada tarjeta de lancha
  const renderReporte = ({ item }) => {
    // Calculamos el total de ítems sumando las cantidades de todas las secciones
    const totalItems = Object.values(item.datos).reduce((acc, seccionItems) => {
      return acc + seccionItems.reduce((sum, i) => sum + i.cantidad, 0);
    }, 0);

    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ReportDetail", { reportId: item.id })}>
        <View style={styles.cardHeader}>
          <Text style={styles.boatName}>{item.nombreLancha}</Text>
          <Text style={styles.date}>{new Date(item.fecha).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.stats}>{totalItems} ítems registrados</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {reportes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay inspecciones recientes.</Text>
          <Text style={styles.emptySubText}>Presiona (+) para comenzar una nueva.</Text>
        </View>
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={(item) => item.id}
          renderItem={renderReporte}
          contentContainerStyle={{ paddingBottom: 80 }} // Espacio para el botón flotante
        />
      )}

      {/* Botón Flotante (FAB) más moderno */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("CreateReport")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  boatName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    color: "#666",
    fontSize: 14,
  },
  stats: {
    color: "#007AFF",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ccc",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -2, // Ajuste visual
  },
});

export default HomeScreen;
