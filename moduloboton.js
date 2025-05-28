(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // ahora con alerta consistente al pulsar 🎨

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

    // listener único que siempre alerta si el icono actual es 🎨
    handle.addEventListener('click', e => {
      e.stopPropagation();
      if (getCurrentIcon() === '🎨') {
        alert('🎨 está siendo pulsado');
      }
      // no hace nada para 💠, ↘️ o 🖌️
    });

    let dragging = false, startX, startY, origX, origY, origW, origH;

    function onMouseDown(e) {
      const icon = getCurrentIcon();
      if (icon === '💠' || icon === '↘️') {
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        origX = block.offsetLeft; origY = block.offsetTop;
        origW = block.offsetWidth; origH = block.offsetHeight;
        handle.style.cursor = 'grabbing';
        e.stopPropagation(); e.preventDefault();
      }
    }
    function onMouseMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const icon = getCurrentIcon();
      if (icon === '💠') {
        block.style.left = origX + dx + 'px';
        block.style.top  = origY + dy + 'px';
      } else if (icon === '↘️') {
        const newW = Math.max(origW + dx, margin*2 + 20);
        const newH = Math.max(origH + dy, margin*2 + 20);
        block.style.width  = newW + 'px';
        block.style.height = newH + 'px';
        innerBtn.style.width  = newW - margin*2 + 'px';
        innerBtn.style.height = newH - margin*2 + 'px';
      }
    }
    function onMouseUp() {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    }

    handle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

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
      onMouseMove({ clientX: t.clientX, clientY: t.clientY });
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', onMouseUp);
  });
})();

