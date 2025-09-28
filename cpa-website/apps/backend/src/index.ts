import 'dotenv/config';
import cors from 'cors';
import express, { json, type Express } from 'express';
import helmet from 'helmet';

import { registerContactRoute } from './routes/contact';
import { registerHealthRoute } from './routes/health';
import { registerStaffRoute } from './routes/staff';

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(json());

registerHealthRoute(app);
registerContactRoute(app);
registerStaffRoute(app);

const port = Number(process.env.PORT ?? 4000);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${port}`);
  });
}

export default app;
