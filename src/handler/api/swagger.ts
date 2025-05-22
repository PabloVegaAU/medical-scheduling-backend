// src/handler/api/swagger.ts:
import swaggerSpec from "@/infrastructure/swagger";
import express from "express";
import serverless from "serverless-http";
import swaggerUi from "swagger-ui-express";
import path from 'path';

const app = express();

// Determinar si estamos en modo offline (desarrollo)
const isOffline = process.env.IS_OFFLINE || process.env.NODE_ENV === 'development';

// Configuración de Swagger UI
const swaggerOptions = {
  customSiteTitle: "Medical Scheduling API",
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: '',
  explorer: true,
  swaggerOptions: {
    url: isOffline ? '/docs.json' : `/${process.env.STAGE}/docs.json`,
    validatorUrl: null
  }
};

// Configuración de rutas para Swagger UI
app.get('/docs', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Medical Scheduling API - Swagger UI</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css">
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin: 0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: '${isOffline ? '/docs.json' : `/${process.env.STAGE}/docs.json`}',
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "StandaloneLayout"
            });
            window.ui = ui;
          }
        </script>
      </body>
    </html>
  `;
  res.send(html);
});

// Ruta para el JSON de la especificación
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Ruta raíz redirige a /docs
app.get("/", (req, res) => {
  res.redirect("/docs");
});

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Configuración para Serverless
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
];

export const handler = serverless(app, {
  binary: binaryMimeTypes
});

// Para desarrollo local
if (isOffline) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
  });
}
