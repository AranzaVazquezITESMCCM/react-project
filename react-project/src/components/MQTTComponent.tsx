import React, { useState, useEffect, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";

const BROKER_URL = "ws://10.48.215.28:8083";

const TOPICS = {
  temperature: "Team4/HomeX/temperature",
  pressure: "Team4/HomeX/pressure",
  rain: "Team4/HomeX/rain",
  ldr: "Team4/HomeX/ldr",
  distance_vl53l0x: "Team4/HomeX/distance_vl53l0x",
  distance_hcsr04: "Team4/HomeX/distance_hcsr04",
  window_state: "Team4/HomeX/window_state",
  fan_state: "Team4/HomeX/fan_state",
  darkness_led: "Team4/HomeX/darkness_led",
  buzzer_active: "Team4/HomeX/buzzer_active",
  button: "Team4/HomeX/button",
};

export interface MQTTData {
  temperature: number;
  pressure: number;
  rain: number;
  ldr: number;
  distance_vl53l0x: number;
  distance_hcsr04: number;
  window_state: string;
  fan_state: string;
  darkness_led: string;
  buzzer_active: string;
  button: string;
  isConnected: boolean;
}

interface MQTTComponentProps {
  onDataUpdate: (data: MQTTData) => void;
}

// Cliente MQTT global para poder usar publishMQTT desde cualquier lugar
let globalClient: MqttClient | null = null;

// Función para publicar mensajes (exportada)
export const publishMQTT = (topic: string, message: string) => {
  if (globalClient?.connected) {
    globalClient.publish(topic, message, (err?: Error) => {
      if (err) {
        console.error(`[MQTT] ✗ Publish failed for ${topic}:`, err);
      } else {
        console.log(`[MQTT] ✓ Published to ${topic}: ${message}`);
      }
    });
  } else {
    console.warn("[MQTT] ⚠ Cannot publish: client not connected");
  }
};

const MQTTComponent: React.FC<MQTTComponentProps> = ({ onDataUpdate }) => {
  const clientRef = useRef<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mqttData, setMqttData] = useState<MQTTData>({
    temperature: 24,
    pressure: 1013,
    rain: 0,
    ldr: 500,
    distance_vl53l0x: 100,
    distance_hcsr04: 100,
    window_state: "open",
    fan_state: "off",
    darkness_led: "off",
    buzzer_active: "quiet",
    button: "released",
    isConnected: false,
  });

  useEffect(() => {
    console.log("[MQTT] Attempting connection...");

    const client = mqtt.connect(BROKER_URL, {
      clientId: `SmartHome_Team4_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      keepalive: 60,
      protocolVersion: 4,
    });

    clientRef.current = client;
    globalClient = client;

    client.on("connect", () => {
      console.log("[MQTT] ✓ Connected to broker!");
      setIsConnected(true);

      // Obtener lista de todos los topics
      const topicList = Object.values(TOPICS);

      // Pequeño delay para asegurar que la conexión está estable
      setTimeout(() => {
        // Verificar que aún estamos conectados antes de suscribirse
        if (client.connected) {
          // Suscribirse a todos los topics de una sola vez (más confiable)
          client.subscribe(topicList, { qos: 0 }, (err: Error | null) => {
            if (err) {
              console.error("[MQTT] ✗ Subscription failed:", err);
              // Intentar suscribirse uno por uno como fallback
              topicList.forEach((topic) => {
                if (client.connected) {
                  client.subscribe(topic, (subErr: Error | null) => {
                    if (subErr) {
                      console.error(`[MQTT] ✗ Failed to subscribe to ${topic}:`, subErr);
                    } else {
                      console.log(`[MQTT] ✓ Subscribed to ${topic}`);
                    }
                  });
                }
              });
            } else {
              console.log(`[MQTT] ✓ Successfully subscribed to all ${topicList.length} topics`);
              topicList.forEach((topic) => {
                console.log(`  - ${topic}`);
              });
            }
          });
        } else {
          console.warn("[MQTT] ⚠ Connection lost before subscription");
        }
      }, 200);
    });

    client.on("message", (topic: string, message: Buffer) => {
      const value = message.toString();
      console.log(`[MQTT] 📩 ${topic}: ${value}`);

      setMqttData((prevData) => {
        const newData: MQTTData = { ...prevData, isConnected: true };

        switch (topic) {
          case TOPICS.temperature:
            newData.temperature = parseFloat(value);
            break;
          case TOPICS.pressure:
            newData.pressure = parseFloat(value);
            break;
          case TOPICS.rain:
            newData.rain = parseInt(value);
            break;
          case TOPICS.ldr:
            newData.ldr = parseInt(value);
            break;
          case TOPICS.distance_vl53l0x:
            newData.distance_vl53l0x = parseFloat(value);
            break;
          case TOPICS.distance_hcsr04:
            newData.distance_hcsr04 = parseFloat(value);
            break;
          case TOPICS.window_state:
            newData.window_state = value;
            break;
          case TOPICS.fan_state:
            newData.fan_state = value;
            break;
          case TOPICS.darkness_led:
            newData.darkness_led = value;
            break;
          case TOPICS.buzzer_active:
            newData.buzzer_active = value;
            break;
          case TOPICS.button:
            newData.button = value;
            break;
        }

        onDataUpdate(newData);
        return newData;
      });
    });

    client.on("error", (err: Error) => {
      console.error("[MQTT] ✗ Error:", err);
      setIsConnected(false);
    });

    client.on("disconnect", () => {
      console.log("[MQTT] ⚠ Disconnected from broker");
      setIsConnected(false);
    });

    client.on("close", () => {
      console.log("[MQTT] ⚠ Connection closed");
      setIsConnected(false);
    });

    client.on("offline", () => {
      console.log("[MQTT] ⚠ Client offline");
      setIsConnected(false);
    });

    client.on("reconnect", () => {
      console.log("[MQTT] 🔄 Reconnecting...");
    });

    return () => {
      console.log("[MQTT] Disconnecting...");
      if (client.connected) {
        client.end(false, () => {
          console.log("[MQTT] ✓ Cleanly disconnected");
        });
      }
      globalClient = null;
    };
  }, [onDataUpdate]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        zIndex: 9999,
        background: isConnected ? "#28a745" : "#dc3545",
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
        fontSize: "12px",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{isConnected ? "🟢" : "🔴"}</span>
        <div>
          <div>MQTT: {isConnected ? "Connected" : "Disconnected"}</div>
          {isConnected && (
            <div style={{ fontSize: "10px", opacity: 0.9 }}>
              Temp: {mqttData.temperature.toFixed(1)}°C | 
              Rain: {mqttData.rain}% | 
              Light: {mqttData.ldr}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MQTTComponent;
export { TOPICS };