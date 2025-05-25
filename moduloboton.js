<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Editor Restaurado</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f8f8f8; height: 100vh; overflow: hidden; position: relative; font-family: sans-serif; }
    /* Mesa (lienzo) ocupa casi toda la pantalla con margen blanco */
    #canvas {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      background: white;
      border: 2px dashed #ccc;
      overflow: auto;
    }
    /* Botón puerta flotante */
    #door {
      position: absolute;
      top: 40px;
      left: 40px;
      width: 40px;
      height: 40px;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 1px solid #aaa;
      border-radius: 4px;
      cursor: grab;
      user-select: none;
      z-index: 10;
    }
    /* Panel deslizante */
    #panel {
      position: absolute;
      top: 0;
      height: 100%;
      width: 0;
      overflow: hidden;
      transition: width 0.3s ease;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  </style>
</head>
<body>
  <div id="canvas"></div>
  <div id="panel"></div>
  <div id="door">🚪</div>

  <!-- Scripts de lógica modularizada -->
  <script src="https://zanahorio326.github.io/prototipohub/moduloboton.js"></script>
  <script>
    (function(){
      const door = document.getElementById('door');
      const panel = document.getElementById('panel');
      const canvas = document.getElementById('canvas');
      let isOpen = false;
      let dragging = false;
      let offsetX = 0, offsetY = 0;

      // Calcular color contrastante
      function invertColor(color) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        if (!m) return '#000';
        const r = (255 - parseInt(m[1], 16)).toString(16).padStart(2, '0');
        const g = (255 - parseInt(m[2], 16)).toString(16).padStart(2, '0');
        const b = (255 - parseInt(m[3], 16)).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
      function computePanelBg() {
        const bg = window.getComputedStyle(canvas).backgroundColor;
        const rgb = bg.match(/\d+/g);
        if (!rgb) return '#000';
        const hex = '#' + rgb.slice(0,3).map(x=>parseInt(x).toString(16).padStart(2,'0')).join('');
        return invertColor(hex);
      }

      // Toggle panel usando módulo botón
      door.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
          const rect = door.getBoundingClientRect();
          panel.style.top = rect.top + 'px';
          panel.style.left = rect.right + 'px';
          panel.style.height = rect.height + 'px';
          panel.style.width = (window.innerWidth - rect.right) + 'px';
          panel.style.background = computePanelBg();
          moduloboton.render(panel);
        } else {
          panel.style.width = '0';
          setTimeout(() => moduloboton.clear(panel), 300);
        }
      });

      // Arrastre de la puerta (ratón y táctil)
      function startDrag(x, y) {
        dragging = true;
        offsetX = x - door.offsetLeft;
        offsetY = y - door.offsetTop;
        door.style.cursor = 'grabbing';
      }
      door.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
      door.addEventListener('touchstart', e => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
      });
      function onMove(x, y) {
        if (!dragging) return;
        let nx = x - offsetX;
        let ny = y - offsetY;
        nx = Math.max(0, Math.min(nx, window.innerWidth - door.offsetWidth));
        ny = Math.max(0, Math.min(ny, window.innerHeight - door.offsetHeight));
        door.style.left = nx + 'px';
        door.style.top = ny + 'px';
      }
      document.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
      document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        onMove(t.clientX, t.clientY);
        e.preventDefault();
      }, { passive: false });
      document.addEventListener('mouseup', () => {
        dragging = false;
        door.style.cursor = 'grab';
      });
      document.addEventListener('touchend', () => { dragging = false; });
    })();
  </script>
</body>
</html>