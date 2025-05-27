(function() {
  // Módulo para crear bloque con botón y cambiar iconos según modo principal
  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  // Estados
  let selector = 'toggleMode';        // 'toggleMode' o 'alternateAction'
  let toggleState = '💠';            // 💠 o ↘️
  let alternateState = '🎨';         // 🎨 o 🖌️

  // Escuchar botones globales
  window.addEventListener('toggleMode', () => {
    selector = 'toggleMode';
    toggleState = '💠';           // reiniciar al primer icono del par
    updateIcon();
  });
  window.addEventListener('alternateAction', () => {
    selector = 'alternateAction';
    alternateState = '🎨';        // reiniciar al primer icono del par
    updateIcon();
  });

  btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return console.warn('canvas no encontrado');

    const margin = 10;
    // Botón interior
    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    Object.assign(innerBtn.style, { cursor: 'pointer', padding: '8px 16px', boxSizing: 'border-box' });
    innerBtn.addEventListener('click', e => e.stopPropagation());

    // Contenedor
    const block = document.createElement('div');
    block.className = 'block';
    Object.assign(block.style, {
      position: 'absolute', left: '50px', top: '50px', padding: margin + 'px',
      background: 'transparent', border: '1px solid #aaa', borderRadius: '4px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'
    });
    block.appendChild(innerBtn);
    canvas.appendChild(block);

    // Ajustar tamaño según contenido
    const rect = innerBtn.getBoundingClientRect();
    block.style.width = rect.width + margin*2 + 'px';
    block.style.height = rect.height + margin*2 + 'px';

    // Icono lateral
    const handle = document.createElement('div');
    Object.assign(handle.style, {
      position: 'absolute', width: '24px', height: '24px',
      bottom: '-12px', right: '-12px', borderRadius: '50%',
      background: '#fff', border: '1px solid #0056b3', display: 'flex',
      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      userSelect: 'none', fontSize: '14px', boxSizing: 'border-box'
    });
    block.appendChild(handle);

    // Actualizar icono según estado
    function updateIcon() {
      handle.textContent = selector === 'toggleMode' ? toggleState : alternateState;
    }
    updateIcon();

    // Pulsar icono para alternar dentro del par actual
    handle.addEventListener('click', e => {
      e.stopPropagation();
      if (selector === 'toggleMode') {
        toggleState = toggleState === '💠' ? '↘️' : '💠';
      } else {
        alternateState = alternateState === '🎨' ? '🖌️' : '🎨';
      }
      updateIcon();
    });

    // Arrastre y redimensionamiento solo en modo toggleMode
    let dragging = false, sx, sy, ox, oy, ow, oh;
    handle.addEventListener('mousedown', e => {
      if (selector !== 'toggleMode') return;
      e.stopPropagation(); dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = block.offsetLeft; oy = block.offsetTop;
      ow = block.offsetWidth; oh = block.offsetHeight;
      handle.style.cursor = 'grabbing'; e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      // mover o redimensionar según toggleState
      if (toggleState === '💠') {
        block.style.left = ox + dx + 'px';
        block.style.top = oy + dy + 'px';
      } else {
        const nw = Math.max(ow + dx, margin*2 + 20);
        const nh = Math.max(oh + dy, margin*2 + 20);
        block.style.width = nw + 'px';
        block.style.height = nh + 'px';
        innerBtn.style.width = nw - margin*2 + 'px';
        innerBtn.style.height = nh - margin*2 + 'px';
      }
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });

    // Táctil equivalente
    handle.addEventListener('touchstart', e => {
      if (selector !== 'toggleMode') return;
      const t = e.touches[0]; e.stopPropagation(); dragging = true;
      sx = t.clientX; sy = t.clientY;
      ox = block.offsetLeft; oy = block.offsetTop;
      ow = block.offsetWidth; oh = block.offsetHeight;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (toggleState === '💠') {
        block.style.left = ox + dx + 'px';
        block.style.top = oy + dy + 'px';
      } else {
        const nw = Math.max(ow + dx, margin*2 + 20);
        const nh = Math.max(oh + dy, margin*2 + 20);
        block.style.width = nw + 'px';
        block.style.height = nh + 'px';
        innerBtn.style.width = nw - margin*2 + 'px';
        innerBtn.style.height = nh - margin*2 + 'px';
      }
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });
  });
})();