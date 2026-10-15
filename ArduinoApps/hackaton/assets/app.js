const botones        = document.querySelectorAll('button[data-modo]');
const ledRojo        = document.querySelector('#led-rojo');
const ledVerde       = document.querySelector('#led-verde');
const statusText     = document.querySelector('#status-text');
const errorContainer = document.querySelector('#error-container');

// Initialize UI
const ui = new WebUI();
ui.on_connect(onUIConnected);
ui.on_disconnect(onUIDisconnected);

ui.on_message('led_status_update', updateLedStatus);

// Los botones se activan UNA sola vez (si se pusieran en onUIConnected,
// cada reconexión añadiría otro "click" y se enviarían mensajes repetidos)
botones.forEach(boton => {
  boton.addEventListener('click', () => handleModoClick(boton.dataset.modo));
});
setBotonesActivos(false);   // desactivados hasta que haya conexión

// Called when the websocket connection is established.
function onUIConnected() {
  errorContainer.textContent = '';
  errorContainer.style.display = 'none';
  setBotonesActivos(true);

  // Requests the initial state from the board.
  ui.send_message('get_initial_state');
}

// Called when the websocket connection is lost.
function onUIDisconnected() {
  errorContainer.style.display = 'block';
  errorContainer.textContent = 'Connection to the board lost. Please check the connection.';
  setBotonesActivos(false);
}

// Python envía: { modo, rojo, verde, status_text }
function updateLedStatus(status) {
  ledRojo.classList.toggle('on', status.rojo);
  ledVerde.classList.toggle('on', status.verde);
  botones.forEach(b => b.classList.toggle('activo', b.dataset.modo === status.modo));
  statusText.textContent = status.status_text;
}

// Al pulsar un botón: 'rojo' | 'verde' | 'ambos' | 'apagado'
function handleModoClick(modo) {
  ui.send_message('set_led_mode', { modo: modo });
}

function setBotonesActivos(activos) {
  botones.forEach(b => b.disabled = !activos);
}