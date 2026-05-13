# HomeX – React Dashboard

Dashboard web para el proyecto IoT **HomeX**, desarrollado con React y TypeScript. Visualiza en tiempo real los datos capturados por los sensores del sistema domótico.

## Tecnologías

- **React** con **TypeScript**
- **Bootstrap 5** – estilos y componentes UI
- **Chart.js** – visualización de datos de sensores

## Sensores integrados

| Sensor | Variable medida |
|--------|----------------|
| BME280 | Temperatura, humedad, presión |
| VL53L0X | Distancia (ToF) |
| HC-SR04 | Distancia ultrasónica |
| LDR | Luminosidad |

Los datos son enviados desde los nodos Arduino vía **MQTT** y consumidos por el dashboard.

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/AranzaVazquezITESMCCM/react-project.git
cd react-project/react-project

# 2. Instala dependencias del proyecto React
npm install

# 3. (Opcional) Instala dependencias del directorio raíz
cd ..
npm install
```

## Ejecución

```bash
cd react-project
npm start
```

La app estará disponible en `http://localhost:3000`.

## Estructura del proyecto

```
react-project/
├── react-project/       # App React principal
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Vistas del dashboard
│   │   └── ...
│   └── package.json
├── node_modules/
└── package.json         # Bootstrap 5 + Chart.js
```

## Equipo

Proyecto desarrollado en el Tecnológico de Monterrey.
