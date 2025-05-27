(function() {
  // Módulo para crear bloques con un botón que cambia icono según dos modos
  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  // Define qué par de iconos está activo: 'toggleMode' o 'alternateAction'
  let selector = 'toggleMode';
  // Iconos actuales dentro de cada par
  let modeIcon = '💠';    // para selector 'toggleMode'
  let paintIcon = '🎨';   // para selector 'alternateAction'

  // Al cambiar de botón global, reiniciar icono al primer símbolo
  window.addEventListener('toggleMode', () => {
    selector = 'toggleMode';
    modeIcon = '💠';      // reinicia a primer icono de ese par
    handle.textContent = modeIcon;
  });
  window.addEventListener('alternateAction', () => {
    selector = 'alternateAction';
    paintIcon = '🎨';     // reinicia a primer icono de ese par
    handle.textContent = paintIcon;
  });

  // Crear bloque y botón interno
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

    // Tamaño al contenido
    const rect = innerBtn.getBoundingClientRect();
    block.style.width = rect.width + margin * 2 + 'px';
    block.style.height = rect.height + margin * 2 + 'px';

    // Crear botón pequeño que alterna
    const handleSize = 24;
    const handle = document.createElement('div');
    Object.assign(handle.style, {
      position: 'absolute', width: handleSize + 'px', height: handleSize + 'px',
      bottom: -(handleSize/2) + 'px', right: -(handleSize/2) + 'px',
      borderRadius: '50%', background: '#fff', border: '1px solid #0056b3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', userSelect: 'none', fontSize: '14px', boxSizing: 'border-box'
    });
    handle.textContent = selector === 'toggleMode' ? modeIcon : paintIcon;
    block.appendChild(handle);

    // Al pulsar handle alternar dentro del par activo
    handle.addEventListener('click', e => {
      e.stopPropagation();
      if (selector === 'toggleMode') {
        // alterna 💠 ↘️
        modeIcon = modeIcon === '💠' ? '↘️' : '💠';
        handle.textContent = modeIcon;
      } else {
        // alterna 🎨 🖌️
        paintIcon = paintIcon === '🎨' ? '🖌️' : '🎨';
        handle.textContent = paintIcon;
      }
    });

    // Arrastrar o redimensionar solo para mover par
    let dragging = false, startX, startY, origX, origY;
    handle.addEventListener('mousedown', e => {
      if (selector !== 'toggleMode' || modeIcon !== '💠') return; // solo mover cuando 💠
      e.stopPropagation(); dragging = true;
      startX = e.clientX; startY = e.clientY;
      origX = block.offsetLeft; origY = block.offsetTop;
      handle.style.cursor = 'grabbing'; e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      block.style.left = origX + (e.clientX - startX) + 'px';
      block.style.top  = origY + (e.clientY - startY) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });

    // Soporte táctil igual
    handle.addEventListener('touchstart', e => {
      const t = e.touches[0];
      if (selector !== 'toggleMode' || modeIcon !== '💠') return;
      e.stopPropagation(); dragging = true;
      startX = t.clientX; startY = t.clientY;
      origX = block.offsetLeft; origY = block.offsetTop;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      const t = e.touches[0];
      block.style.left = origX + (t.clientX - startX) + 'px';
      block.style.top  = origY + (t.clientY - startY) + 'px';
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', () => { if (dragging) { dragging = false; handle.style.cursor = 'pointer'; } });
  });
})();