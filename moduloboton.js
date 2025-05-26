(function() {
  // Este módulo gestiona la creación del bloque + botón centrado con mover/resize toggle
  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return console.warn('canvas no encontrado');

    const margin = 10;
    // Crear botón interno
    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    Object.assign(innerBtn.style, {
      cursor: 'pointer',
      padding: '8px 16px',
      boxSizing: 'border-box'
    });
    innerBtn.dataset.url = '';
    innerBtn.addEventListener('click', e => e.stopPropagation());

    // Crear bloque contenedor
    const block = document.createElement('div');
    block.className = 'block';
    Object.assign(block.style, {
      position: 'absolute',
      left: '50px',
      top: '50px',
      padding: margin + 'px',
      background: 'transparent',
      border: '1px solid #aaa',
      borderRadius: '4px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });
    block.appendChild(innerBtn);
    canvas.appendChild(block);

    // Ajustar tamaño del bloque según botón + margen
    const btnRect = innerBtn.getBoundingClientRect();
    block.style.width = btnRect.width + margin * 2 + 'px';
    block.style.height = btnRect.height + margin * 2 + 'px';

    // Crear handle para mover/resizar en esquina del bloque
    const handleSize = 24;
    const handle = document.createElement('div');
    handle.textContent = '💠';
    Object.assign(handle.style, {
      position: 'absolute',
      width: handleSize + 'px',
      height: handleSize + 'px',
      bottom: -(handleSize / 2) + 'px',
      right: -(handleSize / 2) + 'px',
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

    // Modo actual: 'move' o 'resize'
    let mode = 'move';
    let moved = false;

    // Función toggle: solo si no se movió
    function tryToggle(e) {
      e.stopPropagation();
      if (moved) { moved = false; return; }
      mode = mode === 'move' ? 'resize' : 'move';
      handle.textContent = mode === 'move' ? '💠' : '↘️';
    }
    handle.addEventListener('pointerup', tryToggle);

    // Función de arrastre/resizado
    function setupDrag() {
      let dragging = false;
      let startX, startY, origX, origY, origW, origH;

      handle.addEventListener('pointerdown', e => {
        e.stopPropagation();
        dragging = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        origX = block.offsetLeft;
        origY = block.offsetTop;
        origW = block.offsetWidth;
        origH = block.offsetHeight;
        handle.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('pointermove', e => {
        if (!dragging) return;
        moved = true;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (mode === 'move') {
          block.style.left = origX + dx + 'px';
          block.style.top = origY + dy + 'px';
        } else {
          const newW = Math.max(origW + dx, margin * 2 + 20);
          const newH = Math.max(origH + dy, margin * 2 + 20);
          block.style.width = newW + 'px';
          block.style.height = newH + 'px';
          innerBtn.style.width = newW - margin * 2 + 'px';
          innerBtn.style.height = newH - margin * 2 + 'px';
        }
      });

      document.addEventListener('pointerup', () => {
        if (dragging) {
          dragging = false;
          handle.style.cursor = 'grab';
        }
      });
    }

    setupDrag();
  });
})();