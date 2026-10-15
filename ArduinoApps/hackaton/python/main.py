from arduino.app_utils import *
from arduino.app_bricks.web_ui import WebUI

print("=== Arrancando app de LEDs ===")

MODOS = {
    "rojo":    (True,  False),
    "verde":   (False, True),
    "ambos":   (True,  True),
    "apagado": (False, False),
}

TEXTOS = {
    "rojo":    "LED ROJO ENCENDIDO",
    "verde":   "LED VERDE ENCENDIDO",
    "ambos":   "LOS DOS LEDS ENCENDIDOS",
    "apagado": "LEDS APAGADOS",
}

modo_actual = "apagado"


def get_led_status():
    rojo, verde = MODOS[modo_actual]
    return {"modo": modo_actual, "rojo": rojo, "verde": verde, "status_text": TEXTOS[modo_actual]}


def set_led_mode(client, data):
    global modo_actual

    modo = data.get("modo") if isinstance(data, dict) else str(data)
    if modo not in MODOS:
        print(f"Modo desconocido: {data}")
        return

    modo_actual = modo
    rojo, verde = MODOS[modo]

    try:
        Bridge.call("set_leds", rojo, verde)
        print(f"LEDs -> {modo}")
    except Exception as e:
        print(f"ERROR llamando al sketch: {e}")

    ui.send_message('led_status_update', get_led_status())


def on_get_initial_state(client, data):
    ui.send_message('led_status_update', get_led_status(), client)


ui = WebUI()
print("WebUI creada (puerto 7000)")

ui.on_message('set_led_mode', set_led_mode)
ui.on_message('get_initial_state', on_get_initial_state)

print("Esperando órdenes de la web...")
App.run()