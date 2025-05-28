(function() {
  // Módulo para crear bloques con un botón que muestra iconos según dos modos globales,
  // implementado con dos contadores independientes y lógica de paridad.

  const btn = document.getElementById('modBtn');
  if (!btn) return console.warn('modBtn no encontrado');

  // Dos contadores separados
  let countToggle = 0;     // para 🔁 (💠/↘️)
  let countAlternate = 0;  // para 🔄 (🎨/🖌️)

  // Al pulsar un toggle global, incrementa su contador y resetea el otro
  window.addEventListener('toggleMode', () => {
    countToggle++;
    countAlternate = 0;
    // Actualizar la manecilla si ya hay bloques
    document.querySelectorAll('.block-handle').forEach(h => {
      refreshHandleIcon(h);
    });
  });
  window.addEventListener('alternateAction', () => {
    countAlternate++;
    countToggle = 0;
    document.querySelectorAll('.block-handle').forEach(h => {
      refreshHandleIcon(h);
    });
  });

  // Función que decide qué icono debe mostrar la manecilla
  function getCurrentIcon() {
    if (countAlternate === 0) {
      // modo 1: 💠 (par) / ↘️ (impar)
      return (countToggle % 2 === 0) ? '💠' : '↘️';
    } else {
      // modo 2: 🎨 (impar) / 🖌️ (par)
      return (countAlternate % 2 === 1) ? '🎨' : '🖌️';
    }
  }

  // Refresca el icono de una manecilla existente
  function refreshHandleIcon(handle) {
    handle.textContent = getCurrentIcon();
  }

  // Crear bloque y su manecilla
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
      boxSizing: 'border-box'
    });
    innerBtn.addEventListener('click', e => e.stopPropagation());

    // Contenedor
    const block = document.createElement('div');
    Object.assign(block.style, {
      position: 'absolute',
      left: '50px',
      top: '50px',
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

    // Dimensionar
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
    // Inicializar su icono
    refreshHandleIcon(handle);
    block.appendChild(handle);

    // Arrastrar solo si está en 💠 (modo move)
    let dragging = false, startX, startY, origX, origY;
    handle.addEventListener('mousedown', e => {
      // solo mover si icono actual es 💠
      if (getCurrentIcon() !== '💠') return;
      e.stopPropagation();
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      origX = block.offsetLeft; origY = block.offsetTop;
      handle.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      block.style.left = origX + (e.clientX - startX) + 'px';
      block.style.top  = origY + (e.clientY - startY) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });

    // Touch
    handle.addEventListener('touchstart', e => {
      const t = e.touches[0];
      if (getCurrentIcon() !== '💠') return;
      e.stopPropagation();
      dragging = true;
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
    document.addEventListener('touchend', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'pointer'; }
    });
  });
})();

Qué hace

countToggle y countAlternate acumulan pulsaciones de 🔁 y 🔄 respectivamente.

Al pulsar 🔁 aumenta countToggle y resetea countAlternate; al pulsar 🔄 hace lo inverso.

La función getCurrentIcon() usa la paridad de cada contador para decidir:

🔁 activo (contador de 🔄 = 0): par → 💠, impar → ↘️

🔄 activo (contador de 🔄 > 0): impar → 🎨, par → 🖌️


Cada bloque que creas obtiene una “manecilla” que solo muestra el icono resultante de getCurrentIcon().

La manecilla no altera modos, solo permite mover el bloque cuando muestra 💠.


Así cumples la lógica matemática de paridad y doble memoria que propusiste.

