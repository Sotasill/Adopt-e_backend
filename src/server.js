import express from 'express';
import 'dotenv/config';
import { mainRouter as router } from './routes/index.js';
import initMongoDB from './models/initMongoDB.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import {
  corsMiddleware,
  helmetMiddleware,
  jsonMiddleware,
  errorHandler,
  requestLogger,
  notFound,
} from './middleware/index.js';

const app = express();

app.use(requestLogger);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(jsonMiddleware);

// Swagger документация
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Adopt-e API Documentation',
  })
);

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
