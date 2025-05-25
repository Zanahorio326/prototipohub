// moduloboton.js
// Este módulo gestiona la herramienta "Botón": al pulsar, crea un bloque botón en el canvas principal.

(function() {
  // Esperar a que el botón interno esté disponible
  function init() {
    const btn = document.getElementById('modBtn');
    if (!btn) {
      // Si no existe todavía, reintentar con retraso
      return setTimeout(init, 50);
    }

    btn.addEventListener('click', () => {
      // Ubicación inicial fija (puedes ajustar coordenadas según necesites)
      const x = 30;
      const y = 30;
      // Llamar a la función global addBlock definida en la página principal
      if (typeof addBlock === 'function') {
        addBlock('button', x, y);
      } else {
        console.warn('addBlock no está disponible en el contexto global.');
      }
    });
  }

  // Iniciar módulo
  init();
})();