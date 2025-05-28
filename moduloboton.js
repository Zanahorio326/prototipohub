(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // con panel de personalización al arrastrar en modo 🎨.

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  // Dos contadores para 🔁 y 🔄
  let countToggle = 0;     // para 💠/↘️
  let countAlternate = 0;  // para 🎨/🖌️

  // Al pulsar 🔁 incrementa su contador y resetea el otro
  window.addEventListener('toggleMode', () => {
    countToggle++;
    countAlternate = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });
  // Al pulsar 🔄 incrementa su contador y resetea el otro
  window.addEventListener('alternateAction', () => {
    countAlternate++;
    countToggle = 0;
    document.querySelectorAll('.block-handle').forEach(h => h.textContent = getCurrentIcon());
  });

  // Decide icono según paridad y modo activo
  function getCurrentIcon() {
    if (countAlternate === 0) {
      return (countToggle % 2 === 0) ? '💠' : '↘️';
    } else {
      return (countAlternate % 2 === 1) ? '🎨' : '🖌️';
    }
  }

  // Abrir panel de personalización para el botón
  function openCustomizationPanel(block) {
    // Crear panel
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute',
      top: block.offsetTop + 'px',
      left: (block.offsetLeft + block.offsetWidth + 10) + 'px',
      padding: '8px',
      background: '#fff',
      border: '1px solid #ccc',
      zIndex: 1000
    });
    // Color picker
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#007bff';
    colorInput.addEventListener('input', () => {
      block.querySelector('button').style.background = colorInput.value;
    });
    panel.appendChild(colorInput);
    document.body.appendChild(panel);

    // Cerrar al hacer clic fuera
    function onClickOutside(e) {
      if (!panel.contains(e.target)) {
        panel.remove();
        document.removeEventListener('mousedown', onClickOutside);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
  }

  // Crear bloque y manecilla al pulsar el botón de la barra
  btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return console.warn('canvas no encontrado');
    const margin = 10;

    // Botón interno
    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    Object.assign(innerBtn.style, { cursor: 'pointer', padding: '8px 16px', boxSizing: 'border-box' });
    innerBtn.addEventListener('click', e => e.stopPropagation());

    // Contenedor
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

    // Dimensionar bloque
    const rect = innerBtn.getBoundingClientRect();
    block.style.width  = rect.width  + margin*2 + 'px';
    block.style.height = rect.height + margin*2 + 'px';

    // Manecilla
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

    // Drag & resize o panel de color según icono
    let dragging = false, startX, startY, origX, origY, origW, origH;
    handle.addEventListener('mousedown', e => {
      const icon = getCurrentIcon();
      if (icon === '🎨') {
        // Abrir panel de personalización
        openCustomizationPanel(block);
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

    // Touch equivalente
    handle.addEventListener('touchstart', e => {
      const t = e.touches[0];
      const icon = getCurrentIcon();
      if (icon === '🎨') {
        openCustomizationPanel(block);
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