#include <Arduino_RouterBridge.h>

const int PIN_LED_ROJO  = 7;
const int PIN_LED_VERDE = 6;

// Python la llama con: Bridge.call("set_leds", rojo, verde)
void set_leds(bool rojo, bool verde) {
  digitalWrite(PIN_LED_ROJO,  rojo  ? HIGH : LOW);
  digitalWrite(PIN_LED_VERDE, verde ? HIGH : LOW);
}

void setup() {
  pinMode(PIN_LED_ROJO, OUTPUT);
  pinMode(PIN_LED_VERDE, OUTPUT);
  set_leds(false, false);          // empezar con los dos apagados

  Bridge.begin();
  Bridge.provide("set_leds", set_leds);
}

void loop() {}
