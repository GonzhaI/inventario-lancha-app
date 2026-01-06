import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// --- GENERAR PDF ---
export const exportToPDF = async (reporte) => {
  try {
    let htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, sans-serif; padding: 20px; }
            h1 { color: #007AFF; }
            .header { margin-bottom: 20px; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
            .section-title { background-color: #f0f0f0; padding: 8px; font-weight: bold; margin-top: 15px; border-left: 5px solid #007AFF; }
            .item-row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; }
            .qty { font-weight: bold; color: #333; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Inventario</h1>
            <h2>Lancha: ${reporte.nombreLancha}</h2>
            <p>Fecha: ${new Date(reporte.fecha).toLocaleDateString()} - ${new Date(
      reporte.fecha
    ).toLocaleTimeString()}</p>
          </div>
    `;

    Object.keys(reporte.datos).forEach((seccion) => {
      htmlContent += `<div class="section-title">${seccion}</div>`;
      reporte.datos[seccion].forEach((item) => {
        htmlContent += `
          <div class="item-row">
            <span>${item.nombre}</span>
            <span class="qty">${item.cantidad} un.</span>
          </div>
        `;
      });
    });

    htmlContent += `</body></html>`;

    // Generamos el PDF y obtenemos la URI temporal
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Compartimos el PDF
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  } catch (error) {
    console.error("Error generando PDF:", error);
    alert("Hubo un error al crear el PDF");
  }
};
