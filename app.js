// Pega tu enlace CSV de Google Sheets dentro de las comillas:
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWM1GELO6-3yw4zP2JkODo5YpDYrnDVKtRDu-sJwfAX875Dr4Soix33Hl055ceU0BTnQQNvFYLohFB/pub?gid=0&single=true&output=csv"; 

// Tu número de WhatsApp con código de país (Ejemplo Perú: 51999999999)
const MI_WHATSAPP = "51999999999"; 

async function cargarProductos() {
  try {
    const respuesta = await fetch(SHEET_URL);
    const textoCSV = await respuesta.text();
    
    // Separar las filas de la tabla
    const filas = textoCSV.split('\n').slice(1);
    const contenedor = document.getElementById('productos-container');
    
    contenedor.innerHTML = ""; // Limpiar el texto de "Cargando..."

    filas.forEach(fila => {
      // Separar cada dato de la fila por comas
      const columnas = fila.split(',');
      
      if (columnas.length >= 5) {
        const id = columnas[0]?.trim();
        const nombre = columnas[1]?.trim();
        const precio = columnas[2]?.trim();
        const descripcion = columnas[3]?.trim();
        const imagen = columnas[4]?.trim();

        if (nombre) {
          contenedor.innerHTML += `
            <div class="card">
              <img src="${imagen}" alt="${nombre}" onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'">
              <h3>${nombre}</h3>
              <p>${descripcion}</p>
              <div class="precio">$${precio}</div>
              <button class="btn-whatsapp" onclick="comprarPorWhatsApp('${nombre}', '${precio}')">
                Pedir por WhatsApp
              </button>
            </div>
          `;
        }
      }
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    document.getElementById('productos-container').innerHTML = "<p>Error al cargar el catálogo.</p>";
  }
}

function comprarPorWhatsApp(nombreProducto, precio) {
  const mensaje = `Hola! Vengo de tu tienda web y me interesa comprar: *${nombreProducto}* por un precio de *$${precio}*`;
  const url = `https://wa.me/${MI_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Ejecutar la función al cargar la página
cargarProductos();