(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // ahora con función de 🎨 para cambiar color/degradado del botón interno.

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  // Dos contadores para 🔁 (💠/↘️) y 🔄 (🎨/🖌️)
  let countToggle    = 0;
  let countAlternate = 0;

  // Eventos globales
  window.addEventListener('toggleMode', () => {
    countToggle++;
    countAlternate = 0;
    document.querySelectorAll('.block-handle').forEach(refreshHandle);
  });
  window.addEventListener('alternateAction', () => {
    countAlternate++;
    countToggle = 0;
    document.querySelectorAll('.block-handle').forEach(refreshHandle);
  });

  // Devuelve el icono actual según paridad y conteos
  function getIcon() {
    if (countAlternate === 0) {
      return (countToggle % 2 === 0) ? '💠' : '↘️';
    } else {
      return (countAlternate % 2 === 1) ? '🎨' : '🖌️';
    }
  }

  function refreshHandle(handle) {
    handle.textContent = getIcon();
  }

  // Crea bloque al pulsar el botón de la barra
  btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return console.warn('canvas no encontrado');
    const margin = 10;

    // Botón interno
    const innerBtn = document.createElement('button');
    innerBtn.textContent = 'Botón';
    Object.assign(innerBtn.style, {
      cursor: 'pointer',
      padding: '8px 16px',
      boxSizing: 'border-box',
      background: '#fff'
    });
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

    // Ajustar tamaño
    const rect = innerBtn.getBoundingClientRect();
    block.style.width  = rect.width  + margin*2 + 'px';
    block.style.height = rect.height + margin*2 + 'px';

    // Manecilla/icono
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
    refreshHandle(handle);
    block.appendChild(handle);

    // Pulsar 🖌️ abre selector de color/degradado
    handle.addEventListener('click', e => {
      e.stopPropagation();
      const icon = getIcon();
      if (icon === '🎨') {
        // Crear panel de personalización de color/degradado
        const picker = document.createElement('input');
        picker.type = 'color';
        picker.style.position = 'absolute';
        picker.style.top  = (block.offsetTop + block.offsetHeight + 5) + 'px';
        picker.style.left = (block.offsetLeft) + 'px';
        picker.addEventListener('input', evt => {
          innerBtn.style.background = evt.target.value;
        });
        document.body.appendChild(picker);
        picker.click();
      }
    });

    // Drag & resize para 💠/↘️
    let dragging = false, startX, startY, origX, origY, origW, origH;
    function onDown(e) {
      const icon = getIcon();
      if (icon === '💠' || icon === '↘️') {
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        origX = block.offsetLeft; origY = block.offsetTop;
        origW = block.offsetWidth; origH = block.offsetHeight;
        handle.style.cursor = 'grabbing';
        e.stopPropagation();
        e.preventDefault();
      }
    }
    function onMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      const icon = getIcon();
      if (icon === '💠') {
        block.style.left = origX + dx + 'px';
        block.style.top  = origY + dy + 'px';
      } else {
        const w = Math.max(origW + dx, margin*2 + 20);
        const h = Math.max(origH + dy, margin*2 + 20);
        block.style.width  = w + 'px';
        block.style.height = h + 'px';
        innerBtn.style.width  = w - margin*2 + 'px';
        innerBtn.style.height = h - margin*2 + 'px';
      }
    }
    function onUp() {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    }

    handle.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    handle.addEventListener('touchstart', e => {
      const t = e.touches[0];
      onDown({ clientX: t.clientX, clientY: t.clientY, stopPropagation: ()=>{}, preventDefault: ()=>{} });
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      const t = e.touches[0];
      onMove({ clientX: t.clientX, clientY: t.clientY });
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', onUp);
  });
})();