const WHATSAPP_NUMBER = "51999999999"; // Tu número con código de país

// ID de tu hoja de Google Sheets
const SHEET_ID = "TU_HOJA_DE_GOOGLE_SHEETS_ID";
const URL_SHEETS = `https://opensheet.elk.sh/${SHEETS_ID}/1`;

let productos = [];
let categoriaSeleccionada = "Todos";

async function cargarProductos() {
  const container = document.getElementById("products-grid");
  
  try {
    const respuesta = await fetch(URL_SHEETS);
    productos = await respuesta.json();

    renderizarCategorias();
    renderizarProductos();
  } catch (error) {
    console.error("Error cargando los datos:", error);
    if (container) {
      container.innerHTML = "<p>Error al cargar la tienda. Verifique Google Sheets.</p>";
    }
  }
}

function renderizarCategorias() {
  const container = document.getElementById("categorias-container");
  if (!container) return;

  const categorias = ["Todos", ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  container.innerHTML = categorias.map(cat => `
    <button 
      class="btn-categoria ${cat === categoriaSeleccionada ? 'active' : ''}"
      onclick="filtrarPorCategoria('${cat}')">
      ${cat}
    </button>
  `).join("");
}

function renderizarProductos() {
  const container = document.getElementById("products-grid");
  if (!container) return;

  const listaFiltrada = categoriaSeleccionada === "Todos"
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  container.innerHTML = listaFiltrada.map(prod => {
    // Procesar Tallas
    const arrayTallas = prod.tallas && prod.tallas !== "-" 
      ? prod.tallas.split(",").map(t => t.trim()) 
      : [];

    // Procesar Colores / Tonos
    const arrayColores = prod.colores && prod.colores !== "-" 
      ? prod.colores.split(",").map(c => c.trim()) 
      : [];

    return `
      <article class="product-card">
        <div class="product-image-container">
          <img src="${prod.imagen}" alt="${prod.titulo}" loading="lazy" />
        </div>
        <div class="product-info">
          <h3 class="product-title">${prod.titulo}</h3>
          <p class="product-description">${prod.descripcion}</p>
          <div class="product-price">${prod.precio}</div>

          <!-- Opciones dinámicas -->
          <div class="product-options">
            ${arrayTallas.length > 0 ? `
              <div class="option-group">
                <label>Talla / Tamaño:</label>
                <select id="talla-${prod.id}">
                  ${arrayTallas.map(t => `<option value="${t}">${t}</option>`).join("")}
                </select>
              </div>
            ` : ''}

            ${arrayColores.length > 0 ? `
              <div class="option-group">
                <label>Color / Tono:</label>
                <select id="color-${prod.id}">
                  ${arrayColores.map(c => `<option value="${c}">${c}</option>`).join("")}
                </select>
              </div>
            ` : ''}
          </div>

          <button onclick="enviarWhatsApp('${prod.id}')" class="btn-whatsapp">
            Pedir por WhatsApp
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function filtrarPorCategoria(categoria) {
  categoriaSeleccionada = categoria;
  renderizarCategorias();
  renderizarProductos();
}

// Función que lee los selectores elegidos por el usuario y arma el mensaje de WhatsApp
function enviarWhatsApp(prodId) {
  const producto = productos.find(p => p.id == prodId);
  if (!producto) return;

  const selectTalla = document.getElementById(`talla-${prodId}`);
  const selectColor = document.getElementById(`color-${prodId}`);

  const tallaElegida = selectTalla ? selectTalla.value : null;
  const colorElegido = selectColor ? selectColor.value : null;

  let detalles = [];
  if (tallaElegida) detalles.push(`*Talla/Tamaño:* ${tallaElegida}`);
  if (colorElegido) detalles.push(`*Color/Tono:* ${colorElegido}`);

  const textoDetalles = detalles.length > 0 ? `\n${detalles.join("\n")}` : "";

  const mensaje = encodeURIComponent(
    `¡Hola SUYAI! Me interesa realizar un pedido:\n\n` +
    `*Producto:* ${producto.titulo}\n` +
    `*Precio:* ${producto.precio}` +
    `${textoDetalles}\n\n` +
    `¿Tienen disponibilidad?`
  );

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
}

document.addEventListener("DOMContentLoaded", cargarProductos);