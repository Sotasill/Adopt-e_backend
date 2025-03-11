import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDb } from './db/connection.js';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import { requestLogger, notFound } from './middleware/index.js';

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

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
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
