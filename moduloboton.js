(function(global){
  // Panel de configuración del botón
  const buttonTools = document.createElement('div');
  buttonTools.className = 'button-tools';
  buttonTools.id = 'module-button-tools';
  buttonTools.style.position = 'absolute';
  buttonTools.style.display = 'none';
  buttonTools.style.background = 'rgba(255,255,255,0.95)';
  buttonTools.style.border = '1px solid #ccc';
  buttonTools.style.padding = '10px';
  buttonTools.style.zIndex = '1000';
  buttonTools.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  buttonTools.style.borderRadius = '4px';
  buttonTools.innerHTML = `
    <label>Texto del botón:<input type="text" id="modBtnText" /></label>
    <label>Enlace URL:<input type="text" id="modBtnUrl" /></label>
    <label>Color de fondo:<input type="color" id="modBtnBg" /></label>
    <label>Forma:<select id="modBtnShape">
      <option value="rectangular">Rectangular</option>
      <option value="redondeada">Redondeada</option>
      <option value="circular">Circular</option>
      <option value="rombo">Rombo</option>
    </select></label>
    <button id="modBtnApply">Aplicar</button>
  `;
  document.body.appendChild(buttonTools);

  // Obtener referencias a inputs
  const txtInput = buttonTools.querySelector('#modBtnText');
  const urlInput = buttonTools.querySelector('#modBtnUrl');
  const bgInput  = buttonTools.querySelector('#modBtnBg');
  const shapeSelect = buttonTools.querySelector('#modBtnShape');
  const applyBtn = buttonTools.querySelector('#modBtnApply');

  let currentButton = null;
  let currentBlock = null;

  // Función para renderizar la herramienta en el panel
  function render(container) {
    const toolBtn = document.createElement('div');
    toolBtn.className = 'tool-button';
    toolBtn.innerHTML = '<span>🔘</span><small>Botón</small>';
    toolBtn.addEventListener('click', () => addBlock(30, 30));
    container.appendChild(toolBtn);
  }

  // Función para limpiar el panel
  function clear(container) {
    container.innerHTML = '';
  }

  // Crear bloque de botón
  function addBlock(x, y) {
    const canvas = document.getElementById('canvas');
    const el = document.createElement('div'); el.className = 'block';
    el.style.left = x + 'px'; el.style.top = y + 'px';

    const btn = document.createElement('button');
    btn.textContent = 'Botón';
    btn.dataset.url = '';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (btn.dataset.url) window.open(btn.dataset.url, '_blank');
    });

    el.appendChild(btn);
    makeMovableWithHold(el);
    el.addEventListener('click', e => {
      e.stopPropagation();
      openButtonTools(btn, el);
    });
    canvas.appendChild(el);
  }

  // Mostrar panel de configuración
  function openButtonTools(btn, block) {
    currentButton = btn; currentBlock = block;
    buttonTools.style.display = 'block';
    const rect = block.getBoundingClientRect();
    buttonTools.style.top = (rect.bottom + 8) + 'px';
    buttonTools.style.left = rect.left + 'px';
    txtInput.value = btn.textContent;
    urlInput.value = btn.dataset.url;
    bgInput.value = rgbToHex(getComputedStyle(btn).backgroundColor) || '#ffffff';
    shapeSelect.value = getShape(btn);
  }

  // Aplicar cambios al botón
  applyBtn.addEventListener('click', () => {
    if (!currentButton) return;
    currentButton.textContent = txtInput.value;
    currentButton.dataset.url = urlInput.value;
    currentButton.style.background = bgInput.value;
    applyShape(currentButton, shapeSelect.value);
    buttonTools.style.display = 'none';
  });

  // Obtener forma actual
  function getShape(btn) {
    const br = getComputedStyle(btn).borderRadius;
    const tf = getComputedStyle(btn).transform;
    if (tf.includes('45')) return 'rombo';
    if (br === '50%') return 'circular';
    if (br !== '0px') return 'redondeada';
    return 'rectangular';
  }

  // Aplicar forma
  function applyShape(btn, shape) {
    btn.style.borderRadius = shape === 'rectangular' ? '0' : shape === 'redondeada' ? '8px' : shape === 'circular' ? '50%' : '0';
    btn.style.transform = shape === 'rombo' ? 'rotate(45deg)' : 'none';
  }

  // Hacer bloque movible
  function makeMovableWithHold(el) {
    let isDragging = false, offsetX, offsetY, holdTimer;
    let lastX, lastY;
    const startHold = e => {
      if (e.target === currentButton) return;
      const touch = e.touches ? e.touches[0] : e;
      holdTimer = setTimeout(() => {
        isDragging = true;
        const rect = el.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
      }, 500);
    };
    const move = e => {
      if (!isDragging) return;
      const touch = e.touches ? e.touches[0] : e;
      const canvasRect = document.getElementById('canvas').getBoundingClientRect();
      el.style.left = (touch.clientX - canvasRect.left - offsetX) + 'px';
      el.style.top  = (touch.clientY - canvasRect.top  - offsetY) + 'px';
      lastX = touch.clientX; lastY = touch.clientY;
      e.preventDefault();
    };
    const endHold = () => {
      clearTimeout(holdTimer);
      isDragging = false;
    };
    el.addEventListener('mousedown', startHold);
    el.addEventListener('touchstart', startHold);
    document.addEventListener('mousemove', move, { passive: false });
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', endHold);
    document.addEventListener('touchend', endHold);
  }

  // Convertir RGB a Hex
  function rgbToHex(rgb) {
    const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(rgb);
    return m ? '#' + [1,2,3].map(i => parseInt(m[i]).toString(16).padStart(2,'0')).join('') : rgb;
  }

  // Cerrar panel si clic fuera
  document.addEventListener('click', e => {
    if (buttonTools.style.display === 'block' && !buttonTools.contains(e.target) && currentButton) {
      buttonTools.style.display = 'none';
    }
  });

  // Exportar API
  global.moduloboton = { render, clear };
})(window);


He creado el archivo moduloboton.js con toda la lógica para:

Renderizar el botón “🔘 Botón” en el panel deslizante.

Crear bloques de botón en el lienzo, movibles y configurables.

Mostrar un panel de configuración propio (texto, URL, color, forma).

Aplicar cambios y cerrar el panel cuando se hace clic fuera.


Ahora cada herramienta es completamente modular y el código padre queda limpio. Dime si quieres revisar o ajustar algo concreto.

