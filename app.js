function abrirModalPreview(id) {
  const p = productosGlobales.find(item => item.id == id);
  if (!p) return;

  const sel = (typeof seleccionesUsuario !== 'undefined' && seleccionesUsuario[p.id]) ? seleccionesUsuario[p.id] : {};

  // 1. Carga de datos generales
  const imgElem = document.getElementById('modalImg');
  if (imgElem) imgElem.src = sel.imagenActual || p.imagen;

  const catElem = document.getElementById('modalCat');
  if (catElem) catElem.innerText = p.categoria || '';

  const titleElem = document.getElementById('modalTitle');
  if (titleElem) titleElem.innerText = p.titulo || '';

  const descElem = document.getElementById('modalDesc');
  if (descElem) descElem.innerText = p.descripcion || '';

  // 2. Extraer todos los números encontrados en el producto para identificar Precio Oferta y Precio Lista
  const textoPrecios = `${p.precioText || ''} ${p.precioAnteriorText || ''} ${p.precio || ''} ${p.precioAnterior || ''}`;
  const numeros = (textoPrecios.match(/\d+(\.\d+)?/g) || []).map(Number).filter(n => n > 0);

  let precioOferta = 0;
  let precioLista = 0;

  if (numeros.length >= 2) {
    precioOferta = Math.min(...numeros);
    precioLista = Math.max(...numeros);
  } else if (numeros.length === 1) {
    precioOferta = numeros[0];
  }

  // 3. Cálculo de porcentaje real
  let pct = 0;
  if (precioLista > precioOferta && precioLista > 0) {
    pct = Math.round(((precioLista - precioOferta) / precioLista) * 100);
  }

  // 4. Generar Badge según la regla (> 20%)
  let badgeHtml = '';
  if (pct > 20) {
    badgeHtml = `<span style="background:#e11d48; color:#fff; font-size:0.75rem; font-weight:800; padding:2px 6px; border-radius:4px;">-${pct}%</span>`;
  } else {
    badgeHtml = `<span style="background:#111827; color:#38bdf8; border:1px solid #38bdf8; font-size:0.7rem; font-weight:800; padding:2px 6px; border-radius:4px;">SUYAI</span>`;
  }

  // 5. Renderizado del bloque de precios formateado
  const htmlPrecios = `
    <div id="modalPriceContainer" style="display:flex; align-items:center; gap:8px; margin:10px 0;">
      ${precioLista > precioOferta ? `<span style="font-size:0.95rem; color:#9ca3af; text-decoration:line-through; font-weight:600;">S/ ${precioLista.toFixed(2)}</span>` : ''}
      <span style="font-size:1.3rem; font-weight:900; color:#111827;">S/ ${precioOferta.toFixed(2)}</span>
      ${badgeHtml}
    </div>
  `;

  // Forzar la inyección en el contenedor de precio existente o sobre la disponibilidad
  const container = document.getElementById('modalPriceContainer');
  if (container) {
    container.innerHTML = htmlPrecios;
  } else {
    // Si no existe el id, busca el elemento que contiene "S/" y lo reemplaza
    const stockElem = document.getElementById('modalStock');
    if (stockElem && stockElem.parentNode) {
      let tempDiv = document.getElementById('modalPriceBoxDynamic');
      if (!tempDiv) {
        tempDiv = document.createElement('div');
        tempDiv.id = 'modalPriceBoxDynamic';
        stockElem.parentNode.insertBefore(tempDiv, stockElem);
      }
      tempDiv.innerHTML = htmlPrecios;
    }
  }

  // 6. Stock y apertura
  const stockElem = document.getElementById('modalStock');
  if (stockElem) {
    stockElem.innerText = p.stock > 0 ? `Disponible (${p.stock} unids.)` : 'Agotado';
    stockElem.style.color = p.stock > 0 ? '#16a34a' : '#dc2626';
  }

  const modalElem = document.getElementById('previewModal');
  if (modalElem) modalElem.classList.add('active');
}