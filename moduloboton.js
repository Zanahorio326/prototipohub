(function() {
  // Este módulo gestiona la creación de bloques de botón en el lienzo principal
  const btn = document.getElementById('modBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      // Posición fija o personalizada según diseño
      const x = 50;
      const y = 50;
      // Llamada a la función global addBlock definida en el index
      if (typeof addBlock === 'function') {
        addBlock('button', x, y);
      } else {
        console.warn('addBlock no está definido en el contexto global');
      }
    });
  } else {
    console.warn('modBtn no encontrado en el DOM');
  }
})();