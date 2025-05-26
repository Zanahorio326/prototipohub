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
      if (innerBtn.dataset.url) window.open(innerBtn.dataset.url, '_blank');
    });

    block.appendChild(innerBtn);
    canvas.appendChild(block);

    // Función para hacer el bloque movible (mouse + touch)
    function makeMovable(el) {
      let isDragging = false;
      let startX, startY, origX, origY;

      // Mouse events
      el.addEventListener('mousedown', e => {
        if (e.target === innerBtn) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = parseInt(el.style.left, 10);
        origY = parseInt(el.style.top, 10);
        e.preventDefault();
      });

      document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        el.style.left = origX + (e.clientX - startX) + 'px';
        el.style.top = origY + (e.clientY - startY) + 'px';
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) isDragging = false;
      });

      // Touch events
      el.addEventListener('touchstart', e => {
        const t = e.touches[0];
        if (e.target === innerBtn) return;
        isDragging = true;
        startX = t.clientX;
        startY = t.clientY;
        origX = parseInt(el.style.left, 10);
        origY = parseInt(el.style.top, 10);
        e.preventDefault();
      }, { passive: false });

      document.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const t = e.touches[0];
        el.style.left = origX + (t.clientX - startX) + 'px';
        el.style.top = origY + (t.clientY - startY) + 'px';
        e.preventDefault();
      }, { passive: false });

      document.addEventListener('touchend', () => {
        if (isDragging) isDragging = false;
      });
    }

    // Hacer el bloque movible
    makeMovable(block);
  });
})();