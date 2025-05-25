// moduloboton.js
// Este módulo gestiona la herramienta "Botón" y notifica al parent para crear un bloque botón en el canvas.
(function() {
  // Esperar a que el botón interno esté disponible
  function init() {
    const btn = document.getElementById('modBtn');
    if (!btn) {
      // Si no está aún agregado, reintentar tras un breve retraso
      setTimeout(init, 50);
      return;
    }
    // Cuando se hace click en la herramienta, notificar al parent
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.parent.postMessage({
        source: 'moduloboton',
        action: 'addBlock',
        blockType: 'button'
      }, '*');
    });
  }
  init();
})();