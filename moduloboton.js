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

    // Crear el bloque externo
    const block = document.createElement('div');
    block.className = 'block';
    block.style.position = 'absolute';
    block.style.left = x + 'px';
    block.style.top = y + 'px';
    block.style.padding = '10px';
    block.style.minWidth = '80px';
    block.style.minHeight = '40px';
    block.style.background = 'transparent';
    block.style.border = '1px solid #aaa';
    block.style.borderRadius = '4px';
    block.style.boxSizing = 'border-box';
    block.style.display = 'flex';
    block.style.alignItems = 'center';
    block.style.justifyContent = 'center';

    // Crear el botón interno y centrarlo
    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    innerBtn.style.cursor = 'pointer';
    innerBtn.style.padding = '8px 16px';
    innerBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (innerBtn.dataset.url) window.open(innerBtn.dataset.url, '_blank');
    });
    block.appendChild(innerBtn);

    // Append block first
    canvas.appendChild(block);

    // Crear el handle de arrastre en esquina inferior derecha del bloque
    const handle = document.createElement('div');
    handle.textContent = '💠';
    Object.assign(handle.style, {
      position: 'absolute',
      width: '24px',
      height: '24px',
      bottom: '0px',    // esquina exterior del bloque
      right: '0px',     // esquina exterior del bloque
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
    block.appendChild(handle);

    // Función para hacer el bloque movible usando solo el handle
    function makeMovable(el, handler) {
      let isDragging = false;
      let startX, startY, origX, origY;

      handler.addEventListener('mousedown', e => {
        e.stopPropagation();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = el.offsetLeft;
        origY = el.offsetTop;
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

      handler.addEventListener('touchstart', e => {
        const t = e.touches[0];
        e.stopPropagation();
        isDragging = true;
        startX = t.clientX;
        startY = t.clientY;
        origX = el.offsetLeft;
        origY = el.offsetTop;
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

    // Hacer el bloque movible usando solo el handle
    makeMovable(block, handle);
  });
})();