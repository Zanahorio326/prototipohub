// moduloboton.js
(function() {
  // Este módulo gestiona la creación del bloque + botón centrado en el lienzo principal
  const btn = document.getElementById('modBtn');
  if (!btn) {
    console.warn('modBtn no encontrado en el DOM');
    return;
  }

  btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      console.warn('canvas no encontrado en el DOM');
      return;
    }

    // Coordenadas fijas (ajustables)
    const x = 50;
    const y = 50;

    // Crear el bloque contenedor
    const block = document.createElement('div');
    block.className = 'block';
    block.style.position = 'absolute';
    block.style.left = x + 'px';
    block.style.top = y + 'px';
    block.style.padding = '10px';        // margen interno
    block.style.minWidth = '80px';
    block.style.minHeight = '40px';
    block.style.display = 'flex';        // centrado
    block.style.alignItems = 'center';
    block.style.justifyContent = 'center';
    block.style.background = 'transparent';
    block.style.border = '1px solid #aaa';
    block.style.borderRadius = '4px';
    block.style.boxSizing = 'border-box';

    // Crear el botón interno
    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    innerBtn.style.cursor = 'pointer';
    innerBtn.style.padding = '8px 16px';
    innerBtn.addEventListener('click', e => {
      e.stopPropagation();
      // Aquí puedes añadir la lógica de navegación si btn.dataset.url existe
      if (innerBtn.dataset.url) window.open(innerBtn.dataset.url, '_blank');
    });

    // Montar en el canvas
    block.appendChild(innerBtn);
    canvas.appendChild(block);
  });
})();