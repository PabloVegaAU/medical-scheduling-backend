# 🧱 Estructura del Proyecto: `medical-scheduling-backend`

Este backend utiliza **arquitectura hexagonal (Ports and Adapters)**, lo que permite una separación estricta entre lógica de negocio, entradas/salidas, e infraestructura. La estructura está pensada para proyectos escalables, mantenibles y fácilmente testeables.

```
medical-scheduling-backend/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── serverless.yml
├── tsconfig.json
├── src/
│   ├── adapters/          # Adaptadores para servicios externos
│   ├── application/       # Casos de uso y lógica de negocio
│   ├── domain/            # Modelos de dominio y contratos
│   ├── handler/           # Manejadores Lambda (API, colas)
│   └── infrastructure/    # Clientes y configuraciones AWS
└── tests/                 # Pruebas unitarias y de integración
```

---

## 📂 Descripción de carpetas

### `src/adapters/`

Contiene los **adaptadores secundarios** (driven adapters) que se comunican con servicios externos. Actúan como puentes entre la capa de aplicación y la infraestructura.

- `dynamodb/` → Repositorios específicos por país (CL y PE) para DynamoDB.
- `eventbridge/` → Publicadores de eventos hacia EventBridge.
- `rds/` → Implementación para base de datos relacional (RDS).
- `sns/` → Publicadores hacia tópicos SNS segmentados por país.
- `sqs/` → Lógica para manejo de colas SQS por país.

### `src/application/`

Contiene la lógica de negocio orquestadora. Los **casos de uso** manejan los flujos principales:

- `appointment/`
  - `CreateAppointmentUseCase.ts` → Gestiona la creación de citas médicas.
  - `GetAppointmentsUseCase.ts` → Obtiene citas por ID de asegurado.
  - `AppointmentRepositoryFactory.ts` → Crea instancias de repositorio según el país.

### `src/domain/`

Representa el **corazón del sistema**, donde están definidos los modelos de negocio y sus contratos (interfaces).

- `Appointment.ts` → Entidad principal del sistema.
- `AppointmentRepository.ts` → Puerto de salida que define operaciones de persistencia.

### `src/handler/`

Contiene los **adaptadores primarios** (driving adapters) que manejan eventos externos:

- `api/`
  - `appointment/` → Handlers para la API REST:
    - `createAppointment.ts` → POST /appointments
    - `getAppointments.ts` → GET /appointments/{insuredId}
  - `swagger.ts` → Documentación interactiva
- `queue/` → Procesadores de colas por país:
  - `processPE.ts` → Procesa mensajes de Perú
  - `processCL.ts` → Procesa mensajes de Chile

### `src/infrastructure/`

Implementaciones concretas de clientes AWS con configuración específica:

- `dynamodbClient.ts` → Cliente DynamoDB con configuración optimizada.
- `rdsClient.ts` → Cliente para base de datos relacional con pooling.
- `snsClient.ts` → Cliente SNS con soporte para múltiples tópicos.
- `sqsClient.ts` → Cliente SQS con manejo de colas por país.
- `eventBridgeClient.ts` → Cliente para publicación de eventos en EventBridge.
- `swagger.ts` → Configuración de la documentación OpenAPI.

### `tests/unit/`

Pruebas unitarias organizadas por capas, con enfoque en la lógica del dominio y aplicación.

- `application/appointment/` → Tests para los casos de uso.
- `handlers/` → Tests para los controladores de API y colas.

---

## 🛠 Variables de entorno y despliegue

### Recursos AWS desplegados

- **DynamoDB**:
  - `appointments-table-pe-{stage}` - Tabla para citas de Perú
  - `appointments-table-cl-{stage}` - Tabla para citas de Chile

- **SNS**:
  - `appointments-PE-{stage}` - Tópico para notificaciones de Perú
  - `appointments-CL-{stage}` - Tópico para notificaciones de Chile

- **SQS**:
  - `appointments-PE-queue-{stage}` - Cola para procesamiento en Perú
  - `appointments-CL-queue-{stage}` - Cola para procesamiento en Chile

- **EventBridge**:
  - `appointments-bus-{stage}` - Bus de eventos para orquestación

### Variables de entorno requeridas

```bash
# Credenciales RDS
RDS_HOST=tu-instancia.rds.amazonaws.com
RDS_PORT=5432
RDS_USER=usuario
RDS_PASSWORD=contraseña-segura
RDS_DATABASE=nombre_bd

# Despliegue
serverless deploy --stage dev --region us-east-1
```

### Despliegue multi-etapa

- `dev` - Ambiente de desarrollo
- `staging` - Ambiente de pruebas
- `production` - Ambiente de producción

Ejemplo:
```bash
serverless deploy --stage production --region us-east-1
```

---

## ✅ Buenas prácticas implementadas

- Hexagonal Architecture (Ports and Adapters)
- Inversión de dependencias
- Separación de capas (domain, application, infrastructure)
- Deploy Serverless en AWS
- Variables de entorno para configuración sensible
- Pruebas unitarias por capa

---

## 🧪 Futuras mejoras

- Integración continua (CI/CD)
- Tests de integración y contract testing
- Soporte multi-región o multitenant
- Observabilidad (logs estructurados, métricas, tracing)
