import express from 'express';
import * as routes from './routes';
import { AppDataSource } from './database/database';
import 'dotenv/config';
import { collectDefaultMetrics, register } from 'prom-client';

const main = async() => {
  const app = express();
  collectDefaultMetrics();
  app.use(express.json())


  AppDataSource.initialize()
      .then(() => {
          console.log("Connected to database");
      })
      .catch((error) => console.log(error))


  Object.keys(routes).forEach((routeName) => {
      (routes as any)[routeName](app);
  });

  app.get('/metrics', async (_req, res) => {
      try {
          res.set('Content-Type', register.contentType);
          res.end(await register.metrics());
      } catch (err) {
          res.status(500).end(err);
      }
  });

  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
}

main()