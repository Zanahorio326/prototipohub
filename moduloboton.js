(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // con panel avanzado de selección de color o degradado al arrastrar en modo 🎨.

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  let countToggle = 0;     // para 💠/↘️
  let countAlternate = 0;  // para 🎨/🖌️

  window.addEventListener('toggleMode', () => {
    countToggle++;
    countAlternate = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });
  window.addEventListener('alternateAction', () => {
    countAlternate++;
    countToggle = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });

  function getCurrentIcon() {
    if (countAlternate === 0) {
      return (countToggle % 2 === 0) ? '💠' : '↘️';
    } else {
      return (countAlternate % 2 === 1) ? '🎨' : '🖌️';
    }
  }

  function openColorPanel(block, innerBtn) {
    // Crea panel flotante
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute',
      top: block.offsetTop + 'px',
      left: (block.offsetLeft + block.offsetWidth + 10) + 'px',
      padding: '10px',
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    });

    // Selector de primer color
    const color1 = document.createElement('input');
    color1.type = 'color';
    color1.value = '#007bff';
    color1.addEventListener('input', () => {
      if (!gradientToggle.checked) {
        innerBtn.style.background = color1.value;
      } else {
        updateGradient();
      }
    });
    panel.appendChild(color1);

    // Toggle degradado
    const gradientToggle = document.createElement('button');
    gradientToggle.textContent = 'Degradé';
    Object.assign(gradientToggle.style, {
      padding: '4px 8px',
      cursor: 'pointer'
    });
    panel.appendChild(gradientToggle);

    // Selector de segundo color (oculto inicialmente)
    const color2 = document.createElement('input');
    color2.type = 'color';
    color2.value = '#ff4081';
    Object.assign(color2.style, { display: 'none' });
    color2.addEventListener('input', updateGradient);
    panel.appendChild(color2);

    function updateGradient() {
      innerBtn.style.background = `linear-gradient(${color1.value}, ${color2.value})`;
    }

    gradientToggle.addEventListener('click', () => {
      const active = gradientToggle.classList.toggle('active');
      if (active) {
        color2.style.display = 'block';
        updateGradient();
      } else {
        color2.style.display = 'none';
        innerBtn.style.background = color1.value;
      }
    });

    document.body.appendChild(panel);

    // Cerrar al clicar fuera
    function onClickOutside(e) {
      if (!panel.contains(e.target)) {
        panel.remove();
        document.removeEventListener('mousedown', onClickOutside);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
  }

  btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return console.warn('canvas no encontrado');
    const margin = 10;

    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    Object.assign(innerBtn.style, {
      cursor: 'pointer',
      padding: '8px 16px',
      boxSizing: 'border-box',
      background: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px'
    });
    innerBtn.addEventListener('click', e => e.stopPropagation());

    const block = document.createElement('div');
    Object.assign(block.style, {
      position: 'absolute',
      left: '50px',
      top:  '50px',
      padding: margin + 'px',
      background: 'transparent',
      border: '1px solid #aaa',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
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
      position: 'absolute',
      width: handleSize + 'px',
      height: handleSize + 'px',
      bottom: -(handleSize/2) + 'px',
      right:  -(handleSize/2) + 'px',
      borderRadius: '50%',
      background: '#fff',
      border: '1px solid #0056b3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      fontSize: '14px',
      boxSizing: 'border-box'
    });
    handle.textContent = getCurrentIcon();
    block.appendChild(handle);

    let dragging = false, startX, startY, origX, origY, origW, origH;
    handle.addEventListener('mousedown', e => {
      const icon = getCurrentIcon();
      if (icon === '🎨') {
        openColorPanel(block, innerBtn);
        return;
      }
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
      const dx = e.clientX - startX, dy = e.clientY - startY;
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
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });

    // Touch handlers mirror mouse logic
    handle.addEventListener('touchstart', e => {
      const t = e.touches[0];
      const icon = getCurrentIcon();
      if (icon === '🎨') {
        openColorPanel(block, innerBtn);
        return;
      }
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
      document.dispatchEvent(new MouseEvent('mousemove', {
        clientX: t.clientX, clientY: t.clientY
      }));
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });
  });
})();