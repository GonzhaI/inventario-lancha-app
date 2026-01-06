import React from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from "react-native";
import { useInventory } from "../context/InventoryContext";
import { exportToPDF } from "../utils/exportHelper"; // <--- SOLO IMPORTAMOS PDF

const ReportDetailScreen = ({ route, navigation }) => {
  const { reportId } = route.params;
  const { reportes } = useInventory();

  const reporte = reportes.find((r) => r.id === reportId);

  if (!reporte) return null;

  const seccionesData = Object.keys(reporte.datos).map((nombreSeccion) => ({
    title: nombreSeccion,
    data: reporte.datos[nombreSeccion],
  }));

  return (
    <View style={styles.container}>
      {/* --- BARRA SUPERIOR --- */}
      <View style={styles.toolbar}>
        {/* Botón PDF (ahora ocupa todo el ancho o se ve más prominente) */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
          onPress={() => exportToPDF(reporte)}
        >
          <Text style={styles.actionText}>Exportar a PDF</Text>
        </TouchableOpacity>
      </View>
      {/* --------------------- */}

      {seccionesData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay ítems registrados aún.</Text>
          <Text style={styles.emptySubText}>Agrega productos usando el botón inferior.</Text>
        </View>
      ) : (
        <SectionList
          sections={seccionesData}
          keyExtractor={(item, index) => item.nombre + index}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.nombre}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.cantidad}</Text>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.headerBackground}>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddItem", { reportId: reporte.id })}
      >
        <Text style={styles.addButtonText}>Agregar Ítem / Sección</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "center", // Centramos el botón único
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
  },
  itemRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    color: "#444",
  },
  badge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#1565c0",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ReportDetailScreen;
