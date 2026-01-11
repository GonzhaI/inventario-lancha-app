import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Crear el contexto
const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  // ESTADO: Aquí viven los datos mientras la app está abierta
  const [reportes, setReportes] = useState([]);

  // Catálogos para el autocompletado (Reutilización)
  const [masterLanchas, setMasterLanchas] = useState([]);
  const [masterSecciones, setMasterSecciones] = useState([]);
  const [masterItems, setMasterItems] = useState([]);

  // Cargar datos al iniciar la app
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para leer de la memoria del celular
  const cargarDatos = async () => {
    try {
      const reportesGuardados = await AsyncStorage.getItem("reportes");
      const lanchasGuardadas = await AsyncStorage.getItem("masterLanchas");
      const seccionesGuardadas = await AsyncStorage.getItem("masterSecciones");
      const itemsGuardados = await AsyncStorage.getItem("masterItems");

      if (reportesGuardados) setReportes(JSON.parse(reportesGuardados));
      if (lanchasGuardadas) setMasterLanchas(JSON.parse(lanchasGuardadas));
      if (seccionesGuardadas) setMasterSecciones(JSON.parse(seccionesGuardadas));
      if (itemsGuardados) setMasterItems(JSON.parse(itemsGuardados));
    } catch (e) {
      console.error("Error cargando datos", e);
    }
  };

  // Función interna para actualizar catálogos automáticamente
  // Si lo que escribió no existe, lo agrega al catálogo.
  const actualizarMaestros = async (tipo, valor) => {
    let nuevoArray = [];
    let key = "";

    if (tipo === "lancha") {
      if (masterLanchas.includes(valor)) return; // Ya existe
      nuevoArray = [...masterLanchas, valor];
      setMasterLanchas(nuevoArray);
      key = "masterLanchas";
    } else if (tipo === "seccion") {
      if (masterSecciones.includes(valor)) return;
      nuevoArray = [...masterSecciones, valor];
      setMasterSecciones(nuevoArray);
      key = "masterSecciones";
    } else if (tipo === "item") {
      if (masterItems.includes(valor)) return;
      nuevoArray = [...masterItems, valor];
      setMasterItems(nuevoArray);
      key = "masterItems";
    }

    if (key) await AsyncStorage.setItem(key, JSON.stringify(nuevoArray));
  };

  // ACCIONES: Crear un nuevo reporte
  const crearReporte = async (nombreLancha) => {
    const nuevoReporte = {
      id: Date.now().toString(),
      nombreLancha,
      fecha: new Date().toISOString(),
      datos: {}, // Empieza vacío, se llenará por secciones
    };

    const nuevosReportes = [nuevoReporte, ...reportes];
    setReportes(nuevosReportes);
    await AsyncStorage.setItem("reportes", JSON.stringify(nuevosReportes));

    // Aprovechamos para guardar el nombre de la lancha en el catálogo si es nueva
    await actualizarMaestros("lancha", nombreLancha);

    return nuevoReporte.id;
  };

  // ACCIONES: Agregar ítem a un reporte específico
  const agregarItem = async (reporteId, nombreSeccion, nombreItem, cantidad) => {
    // Actualizamos catálogos primero
    await actualizarMaestros("seccion", nombreSeccion);
    await actualizarMaestros("item", nombreItem);

    const reportesActualizados = reportes.map((rep) => {
      if (rep.id === reporteId) {
        // Clonamos los datos actuales
        const nuevosDatos = { ...rep.datos };

        // Si la sección no existe en este reporte, la creamos como array vacío
        if (!nuevosDatos[nombreSeccion]) {
          nuevosDatos[nombreSeccion] = [];
        }

        // Agregamos el ítem
        nuevosDatos[nombreSeccion].push({
          nombre: nombreItem,
          cantidad: parseInt(cantidad) || 0,
        });

        return { ...rep, datos: nuevosDatos };
      }
      return rep;
    });

    setReportes(reportesActualizados);
    await AsyncStorage.setItem("reportes", JSON.stringify(reportesActualizados));
  };

  // ACCIONES: Editar un ítem dentro de un reporte específico
  const editarItem = async (reporteId, nombreSeccion, index, nuevoItem) => {
    const reportesActualizados = reportes.map((rep) => {
      if (rep.id === reporteId) {
        const nuevosDatos = { ...rep.datos };
        // Actualizar el ítem en la posición específica
        nuevosDatos[nombreSeccion][index] = {
          nombre: nuevoItem.nombre,
          cantidad: parseInt(nuevoItem.cantidad) || 0,
        };
        return { ...rep, datos: nuevosDatos };
      }
      return rep;
    });

    setReportes(reportesActualizados);
    await AsyncStorage.setItem("reportes", JSON.stringify(reportesActualizados));

    // Actualizar maetros si el nombre cambió
    await actualizarMaestros("item", nuevoItem.nombre);
  };

  // ACCIONES: Eliminar un ítem dentro de un reporte específico
  const eliminarItem = async (reporteId, nombreSeccion, index) => {
    const reportesActualizados = reportes.map((rep) => {
      if (rep.id === reporteId) {
        const nuevosDatos = { ...rep.datos };
        // Filtro para eliminar por índice
        nuevosDatos[nombreSeccion] = nuevosDatos[nombreSeccion].filter((_, i) => i !== index);

        // Si la sección queda vacía, se puede eliminar la sección
        if (nuevosDatos[nombreSeccion].length === 0) {
          delete nuevosDatos[nombreSeccion];
        }

        return { ...rep, datos: nuevosDatos };
      }
      return rep;
    });
    setReportes(reportesActualizados);
    await AsyncStorage.setItem("reportes", JSON.stringify(reportesActualizados));
  };

  // ACCIONES: Eliminar un reporte (por si se equivoca)
  const eliminarReporte = async (id) => {
    const filtrados = reportes.filter((r) => r.id !== id);
    setReportes(filtrados);
    await AsyncStorage.setItem("reportes", JSON.stringify(filtrados));
  };

  const eliminarSugerenciaItem = async (valor) => {
    const nuevoArray = masterItems.filter((i) => i !== valor);
    setMasterItems(nuevoArray);
    await AsyncStorage.setItem("masterItems", JSON.stringify(nuevoArray));
  };

  const eliminarSugerenciaSeccion = async (valor) => {
    const nuevoArray = masterSecciones.filter((s) => s !== valor);
    setMasterSecciones(nuevoArray);
    await AsyncStorage.setItem("masterSecciones", JSON.stringify(nuevoArray));
  };

  return (
    <InventoryContext.Provider
      value={{
        reportes,
        masterLanchas,
        masterSecciones,
        masterItems,
        crearReporte,
        agregarItem,
        editarItem,
        eliminarItem,
        eliminarReporte,
        eliminarSugerenciaItem,
        eliminarSugerenciaSeccion,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

// Hook personalizado para usar esto fácil en cualquier pantalla
export const useInventory = () => useContext(InventoryContext);
