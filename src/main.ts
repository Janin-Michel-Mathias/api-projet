import express from 'express';
import * as routes from './routes';
import { AppDataSource } from './database/database';

const app = express();

const main = async() => {

  AppDataSource.initialize()
      .then(() => {
          console.log("Connected to database");
      })
      .catch((error) => console.log(error))


  Object.keys(routes).forEach((routeName) => {
      (routes as any)[routeName](app);
  });


  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
}

main()