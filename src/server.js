import express from 'express';
import 'dotenv/config';
import { mainRouter as router } from './routes/index.js';
import initMongoDB from './models/initMongoDB.js';
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

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
