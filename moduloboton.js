// moduloboton.js
(function() {
  // Este módulo gestiona la creación del bloque + botón centrado y manejador de arrastre
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

    // Añadir primero el botón
    block.appendChild(innerBtn);

    // Crear el manejador de arrastre (esquina inferior derecha del bloque)
    const handle = document.createElement('div');
    handle.textContent = '💠';
    Object.assign(handle.style, {
      position: 'absolute',
      width: '24px',
      height: '24px',
      bottom: '4px',
      right: '4px',
      borderRadius: '50%',
      background: '#fff',
      border: '1px solid #0056b3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'grab',
      userSelect: 'none',
      fontSize: '14px',
      boxSizing: 'border-box'
    });
    // Asegurarnos de que block sea el contenedor relativo
    block.style.position = 'absolute';
    block.appendChild(handle);

    canvas.appendChild(block);

    // Función para hacer el bloque movible desde el handle (mouse + touch)
    function makeMovable(el, handler) {
      let isDragging = false;
      let startX, startY, origX, origY;

      // Inicio de arrastre (ratón)
      handler.addEventListener('mousedown', e => {
        e.stopPropagation();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = parseInt(el.style.left, 10);
        origY = parseInt(el.style.top, 10);
        handler.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        el.style.left = origX + (e.clientX - startX) + 'px';
        el.style.top = origY + (e.clientY - startY) + 'px';
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          handler.style.cursor = 'grab';
        }
      });

      // Touch events
      handler.addEventListener('touchstart', e => {
        const t = e.touches[0];
        e.stopPropagation();
        isDragging = true;
        startX = t.clientX;
        startY = t.clientY;
        origX = parseInt(el.style.left, 10);
        origY = parseInt(el.style.top, 10);
        handler.style.cursor = 'grabbing';
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
        if (isDragging) {
          isDragging = false;
          handler.style.cursor = 'grab';
        }
      });
    }

    // Hacer el bloque movible usando el handle
    makeMovable(block, handle);
  });
})();

