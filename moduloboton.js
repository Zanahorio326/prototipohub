// moduloboton.js
// Este script agrega la funcionalidad de creación de bloques de botón al hacer clic en el botón de herramienta

// Esperamos a que el botón exista en el DOM
document.addEventListener('DOMContentLoaded', () => {
  const modBtn = document.getElementById('modBtn');
  if (!modBtn) return;

  // Al hacer clic, creamos un bloque de tipo 'button' en el canvas
  modBtn.addEventListener('click', () => {
    // Llama a la función global addBlock definida en la página principal
    // Posición por defecto (30,30)
    if (typeof addBlock === 'function') {
      addBlock('button', 30, 30);
    } else {
      console.error('addBlock no está disponible.');
    }
  });
});