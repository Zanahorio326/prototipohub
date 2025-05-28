(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // y abre tarjeta flotante al pulsar 🎨 en la manija

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  let countToggle = 0;     // para 💠/↘️
  let countAlternate = 0;  // para 🎨/🖌️

  window.addEventListener('toggleMode', () => {
    countToggle++;
    countAlternate = 0;
    document.querySelectorAll('.block-handle').forEach(refreshHandleIcon);
  });
  window.addEventListener('alternateAction', () => {
    countAlternate++;
    countToggle = 0;
    document.querySelectorAll('.block-handle').forEach(refreshHandleIcon);
  });

  function getCurrentIcon() {
    if (countAlternate === 0) {
      return (countToggle % 2 === 0) ? '💠' : '↘️';
    } else {
      return (countAlternate % 2 === 1) ? '🎨' : '🖌️';
    }
  }

  function refreshHandleIcon(handle) {
    handle.textContent = getCurrentIcon();
  }

  btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return console.warn('canvas no encontrado');
    const margin = 10;

    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    Object.assign(innerBtn.style, { cursor: 'pointer', padding: '8px 16px', boxSizing: 'border-box' });
    innerBtn.addEventListener('click', e => e.stopPropagation());

    const block = document.createElement('div');
    Object.assign(block.style, {
      position: 'absolute', left: '50px', top: '50px', padding: margin + 'px',
      background: 'transparent', border: '1px solid #aaa', borderRadius: '4px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'
    });
    block.appendChild(innerBtn);
    canvas.appendChild(block);

    const rect = innerBtn.getBoundingClientRect();
    block.style.width  = rect.width  + margin*2 + 'px';
    block.style.height = rect.height + margin*2 + 'px';

    const handleSize = 24;
    const handle = document.createElement('div');
    handle.classList.add('block-handle');
    Object.assign(handle.style, {
      position: 'absolute', width: handleSize + 'px', height: handleSize + 'px',
      bottom: -(handleSize/2) + 'px', right:  -(handleSize/2) + 'px',
      borderRadius: '50%', background: '#fff', border: '1px solid #0056b3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', userSelect: 'none', fontSize: '14px', boxSizing: 'border-box'
    });
    refreshHandleIcon(handle);
    block.appendChild(handle);

    // Al pulsar manija
    handle.addEventListener('click', e => {
      e.stopPropagation();
      const icon = getCurrentIcon();
      if (icon === '🎨') {
        // Crear tarjeta flotante
        const card = document.createElement('div');
        card.textContent = 'actualización';
        Object.assign(card.style, {
          position: 'absolute',
          top: (block.offsetTop + block.offsetHeight + 10) + 'px',
          left: block.offsetLeft + 'px',
          background: '#fff',
          border: '1px solid #333',
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          zIndex: 1000
        });
        // Cerrar tarjeta tras 2s
        setTimeout(() => card.remove(), 2000);
        document.body.appendChild(card);
      }
    });

    // Movimiento y redimension
    let dragging = false, startX, startY, origX, origY, origW, origH;
    handle.addEventListener('mousedown', e => {
      const icon = getCurrentIcon();
      if (icon === '💠' || icon === '↘️') {
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        origX = block.offsetLeft; origY = block.offsetTop;
        origW = block.offsetWidth; origH = block.offsetHeight;
        handle.style.cursor = 'grabbing';
        e.stopPropagation(); e.preventDefault();
      }
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (getCurrentIcon() === '💠') {
        block.style.left = origX + dx + 'px';
        block.style.top  = origY + dy + 'px';
      } else {
        const newW = Math.max(origW + dx, margin*2 + 20);
        const newH = Math.max(origH + dy, margin*2 + 20);
        block.style.width  = newW + 'px';
        block.style.height = newH + 'px';
        innerBtn.style.width  = newW - margin*2 + 'px';
        innerBtn.style.height = newH - margin*2 + 'px';
      }
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });

    // Táctil
    handle.addEventListener('touchstart', e => {
      const t = e.touches[0];
      const icon = getCurrentIcon();
      if (icon === '💠' || icon === '↘️') {
        dragging = true;
        startX = t.clientX; startY = t.clientY;
        origX = block.offsetLeft; origY = block.offsetTop;
        origW = block.offsetWidth; origH = block.offsetHeight;
      }
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      const t = e.touches[0];
      const event = { clientX: t.clientX, clientY: t.clientY };
      document.dispatchEvent(new MouseEvent('mousemove', event));
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });
  });
    });
})();

/* Añadido feedback visual para el estado "pulsado" en la manecilla */
const style = document.createElement('style');
style.textContent = `
  .block-handle:active {
    background: #e0e0e0;
    transform: scale(0.9);
  }
`;
document.head.appendChild(style);