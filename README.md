Entendido, Pablo. Aquí tienes el README.md revisado, sin ejemplos directos de código interno, pero con ejemplos prácticos de uso de la API REST para que cualquier usuario o desarrollador pueda entender y probar fácilmente los endpoints. Lo mantuve enfocado en claridad, potencia y profesionalismo:

---

````markdown
# 🚀 Medical Scheduling Backend - Serverless API on AWS

![Serverless Framework](https://img.shields.io/badge/Serverless-Framework-blue?logo=serverless)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange?logo=aws)
![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-blue?logo=aws)
![Node.js](https://img.shields.io/badge/Node.js-16+-green?logo=node.js)

---

## 🌟 Proyecto Overview

**Medical Scheduling Backend** es una API RESTful ultra escalable y eficiente para la gestión de citas médicas, diseñada con arquitectura hexagonal y desplegada en AWS Lambda usando **Serverless Framework**. La base de datos es DynamoDB con integración avanzada de SNS, SQS y EventBridge para eventos y colas distribuidas, garantizando alta disponibilidad, desacoplamiento y procesamiento asíncrono robusto.

---

## 🎯 Características Clave

- **Arquitectura Limpia**: Implementa arquitectura hexagonal con separación clara de responsabilidades.
- **Multi-país**: Soporte nativo para Perú (PE) y Chile (CL) con recursos dedicados.
- **Escalabilidad**: Serverless con AWS Lambda, procesamiento por lotes y colas SQS.
- **Event-Driven**: Integración con EventBridge para orquestación de eventos.
- **Documentación**: API documentada con Swagger/OpenAPI.
- **Seguridad**: Permisos IAM granulares y variables de entorno para datos sensibles.

---

## 📦 Estructura del Proyecto

```plaintext
medical-scheduling-backend/
├── src/
│   ├── adapters/          # Integraciones externas (DynamoDB, SNS, SQS)
│   ├── application/       # Casos de uso y lógica de negocio
│   ├── domain/            # Modelos de dominio y entidades
│   ├── handlers/          # Handlers AWS Lambda para HTTP, SQS
│   ├── infrastructure/    # Configuraciones específicas y utilidades infra
│   └── handler/api/       # Endpoints HTTP (API REST)
├── serverless.yml         # Infraestructura como código (IaC) para AWS
├── .env                   # Variables de entorno sensibles
├── README.md              # Documentación del proyecto
└── package.json           # Dependencias y scripts Node.js
```
````

---

## 🚀 Despliegue Rápido

### Requisitos previos

- Node.js 20.x
- Serverless Framework 3.x
- AWS CLI configurado con credenciales válidas
- Archivo `.env` con las variables de entorno requeridas

### Instalación

```bash
# Instalar dependencias
npm install

# Instalar Serverless Framework globalmente (si no lo tienes)
npm install -g serverless
```

### Configuración

Crea un archivo `.env` en la raíz del proyecto con:

```bash
# Credenciales RDS
RDS_HOST=tu-instancia.rds.amazonaws.com
RDS_PORT=5432
RDS_USER=usuario
RDS_PASSWORD=contraseña-segura
RDS_DATABASE=nombre_bd
```

### Despliegue

```bash
# Desplegar en desarrollo
serverless deploy --stage dev

# Desplegar en producción
serverless deploy --stage production
```

---

## 🔧 Uso de la API REST

### Crear una cita médica (POST /appointments)

Envía una solicitud POST con el siguiente JSON:

```json
{
  "insuredId": "123456789",
  "scheduleId": 1,
  "countryISO": "CL",
  "status": "pending"
}
```

Ejemplo con cURL:

```bash
curl -X POST https://<api-id>.execute-api.us-east-1.amazonaws.com/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "insuredId": "123456789",
    "scheduleId": 1,
    "countryISO": "CL"
  }'
```

Respuesta exitosa (201 Created):

```json
{
  "insuredId": "123456789",
  "scheduleId": 1,
  "countryISO": "CL",
  "status": "pending",
  "createdAt": "2025-05-22T10:23:00.000Z"
}
```

**Nota:** El campo `countryISO` solo acepta "PE" o "CL" y determina en qué tabla se guardará la cita.

---

### Consultar citas de un asegurado (GET /appointments/{insuredId})

Obtiene todas las citas de un asegurado. Ejemplo:

```bash
# Obtener citas de un asegurado
curl https://<api-id>.execute-api.us-east-1.amazonaws.com/appointments/123456789
```

Respuesta exitosa (200 OK):

```json
[
  {
    "insuredId": "123456789",
    "scheduleId": 1,
    "countryISO": "CL",
    "status": "pending",
    "createdAt": "2025-05-22T10:23:00.000Z"
  }
]
```

**Parámetros de consulta opcionales:**
- `countryISO`: Filtrar por país (PE o CL)
- `status`: Filtrar por estado (pending/completed)

Ejemplo con filtros:
```bash
curl "https://<api-id>.execute-api.us-east-1.amazonaws.com/appointments/123456789?countryISO=CL&status=pending"
```

---

### Documentación interactiva

La API expone una documentación Swagger accesible en:

```
GET https://<api-id>.execute-api.us-east-1.amazonaws.com/docs
```

Desde ahí puedes probar todos los endpoints, revisar esquemas y respuestas.

---

## ⚙️ Arquitectura y Eventos

### Flujo de datos

1. **Creación de Cita**:
   - El cliente envía una petición a la API
   - Se valida y guarda en DynamoDB según el país (PE/CL)
   - Se publica un evento en el tópico SNS correspondiente
   - Se encola el mensaje en SQS para procesamiento asíncrono

2. **Procesamiento**:
   - Los workers de SQS procesan los mensajes en lotes
   - Se actualiza el estado de las citas
   - Se publican eventos en EventBridge para integraciones

### Recursos por país

- **Perú (PE)**:
  - Tabla: `appointments-table-pe-{stage}`
  - Tópico: `appointments-PE-{stage}`
  - Cola: `appointments-PE-queue-{stage}`

- **Chile (CL)**:
  - Tabla: `appointments-table-cl-{stage}`
  - Tópico: `appointments-CL-{stage}`
  - Cola: `appointments-CL-queue-{stage}`

---

## 🧪 Desarrollo Local

### Ejecutar localmente

```bash
# Instalar dependencias de desarrollo
npm install -D serverless-offline serverless-dynamodb-local

# Iniciar DynamoDB local
serverless dynamodb install

# Iniciar el entorno local
serverless offline start
```

### Ejecutar pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

### Variables de entorno para desarrollo

Crea un archivo `.env.test` para pruebas:

```bash
# DynamoDB Local
DYNAMODB_ENDPOINT=http://localhost:8000

# Configuración local
STAGE=dev
REGION=us-east-1
```

---

## 🔐 Seguridad

- Variables sensibles gestionadas con `.env` y plugin para Serverless.
- Roles IAM con mínimos permisos requeridos.
- DynamoDB configurado en modo PAY_PER_REQUEST para costo eficiente y escalabilidad.

---

## 🤝 Contribuciones

¿Quieres aportar? Abre un issue o pull request y conversemos para mantener la calidad y visión del backend.

---

## 👨‍💻 Autor

**Pablo** – Desarrollador Backend Senior apasionado por arquitectura limpia, alto rendimiento y soluciones serverless.

---

¡Un backend listo para escalar en producción con la flexibilidad y potencia que solo Serverless Framework y AWS ofrecen!

```

```
