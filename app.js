// Reemplaza con tu número de WhatsApp real (código de país + número, ej: 51999999999)
const WHATSAPP_NUMBER = "51999999999";

// Si usas Google Sheets, aquí harías el fetch. Por ahora dejamos el array de ejemplo corregido:
const products = [
  {
    id: 1,
    title: "Camiseta Negra 100% Algodón",
    description: "Camiseta de corte clásico en algodón peinado de alta calidad. Cómoda, fresca y duradera.",
    price: "$25",
    // Imagen de alta calidad que encaje bien
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
  }
];

function renderProducts() {
  const container = document.getElementById("products-grid");
  if (!container) return;

  container.innerHTML = products.map(product => {
    // Mensaje automático para el chat de WhatsApp
    const message = encodeURIComponent(`¡Hola SUYAI! Me interesa comprar el producto: *${product.title}* (${product.price}).`);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    return `
      <article class="product-card">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.title}" loading="lazy" />
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">${product.price}</div>
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", renderProducts);