import express from 'express';
import * as routes from './routes';

const app = express();

Object.keys(routes).forEach((routeName) => {
    (routes as any)[routeName](app);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
