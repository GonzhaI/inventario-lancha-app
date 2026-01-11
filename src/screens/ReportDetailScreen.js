import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useInventory } from "../context/InventoryContext";
import { exportToPDF } from "../utils/exportHelper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ReportDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets(); // Obtener los espacios del sistema
  const { reportId } = route.params;
  const { reportes, eliminarReporte, eliminarItem } = useInventory();

  // Buscamos el reporte actual en el contexto
  const reporte = reportes.find((r) => r.id === reportId);

  if (!reporte) {
    return (
      <View style={styles.center}>
        <Text>Reporte no encontrado</Text>
      </View>
    );
  }

  const handleEliminarReporte = () => {
    Alert.alert("Eliminar Reporte", "¿Estás seguro de que quieres borrar toda esta inspección?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await eliminarReporte(reportId);
          navigation.goBack();
        },
      },
    ]);
  };

  const confirmEliminarItem = (seccion, index) => {
    Alert.alert("Eliminar ítem", "¿Borrar este producto del inventario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: () => eliminarItem(reportId, seccion, index),
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, paddingRigh: insets.right }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{reporte.nombreLancha}</Text>
          <Text style={styles.subtitle}>
            {new Date(reporte.fecha).toLocaleDateString()} - {new Date(reporte.fecha).toLocaleTimeString()}
          </Text>
        </View>

        {Object.keys(reporte.datos).length === 0 ? (
          <Text style={styles.emptyText}>No hay productos registrados aún.</Text>
        ) : (
          Object.keys(reporte.datos).map((seccion) => (
            <View key={seccion} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{seccion}</Text>
              {reporte.datos[seccion].map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.nombre}</Text>
                    <Text style={styles.itemQty}>Cantidad: {item.cantidad}</Text>
                  </View>

                  <View style={styles.actions}>
                    {/* BOTÓN EDITAR: Navega a AddItem con los datos actuales */}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() =>
                        navigation.navigate("AddItem", {
                          reportId,
                          itemEdit: item,
                          seccionEdit: seccion,
                          indexEdit: index,
                        })
                      }
                    >
                      <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>

                    {/* BOTÓN ELIMINAR ÍTEM */}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteItemButton]}
                      onPress={() => confirmEliminarItem(seccion, index)}
                    >
                      <Text style={styles.actionText}>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}

        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.pdfButton} onPress={() => exportToPDF(reporte)}>
            <Text style={styles.buttonText}>Exportar PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteReportButton} onPress={handleEliminarReporte}>
            <Text style={styles.buttonText}>Eliminar Reporte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Botón Flotante para añadir más ítems rápido */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddItem", { reportId })}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  itemRow: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    elevation: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemQty: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  deleteItemButton: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#F44336",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  footerButtons: {
    marginTop: 30,
  },
  pdfButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteReportButton: {
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  fabText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ReportDetailScreen;
