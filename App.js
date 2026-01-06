import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InventoryProvider } from "./src/context/InventoryContext";
import CreateReportScreen from "./src/screens/CreateReportScreen";
import ReportDetailScreen from "./src/screens/ReportDetailScreen";
import AddItemScreen from "./src/screens/AddItemScreen";

// Importamos las pantallas
import HomeScreen from "./src/screens/HomeScreen";

// Creamos el objeto Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // 1. El Proveedor de Datos envuelve a toda la app
    <InventoryProvider>
      {/* 2. El Contenedor de Navegación gestiona el estado de las pantallas */}
      <NavigationContainer>
        {/* 3. El Navigator define las rutas disponibles */}
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inventario Náutico" }} />

          <Stack.Screen name="CreateReport" component={CreateReportScreen} options={{ title: "Nueva Inspección" }} />

          <Stack.Screen
            name="ReportDetail"
            component={ReportDetailScreen}
            options={({ route }) => ({ title: "Detalle de Inventario" })}
          />

          <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: "Agregar Producto" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </InventoryProvider>
  );
}
