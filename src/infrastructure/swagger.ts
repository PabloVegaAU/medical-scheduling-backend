// src/infrastructure/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medical Scheduling Backend API",
      version: "1.0.0",
      description: "API para el sistema de agendamiento de citas médicas",
    },
    servers: [
      {
        url: "https://nvv1o9tda2.execute-api.us-east-1.amazonaws.com/{stage}", // Cambiar por URL real
        variables: {
          stage: {
            default: "dev",
          },
        },
      },
    ],
  },
  // Path to the API docs
  apis: ["./src/handler/api/**/*.ts"], // Archivos donde se ponen los comentarios Swagger (OpenAPI)
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
