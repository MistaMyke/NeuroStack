import 'dotenv/config';
import cors from 'cors';
import express, { json, type Express } from 'express';
import helmet from 'helmet';

import { registerContactRoute } from './routes/contact';
import { registerHealthRoute } from './routes/health';
import { registerStaffRoute } from './routes/staff';
import { registerAiRoute } from './routes/ai';
import { registerDemoRoute } from './routes/demo';
import { registerPortalRoute } from './routes/portal';
import { demoSessionMiddleware } from './middleware/demoAuth';

const app: Express = express();
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  }),
);
app.use(json());
app.use(demoSessionMiddleware);

registerHealthRoute(app);
registerContactRoute(app);
registerStaffRoute(app);
registerAiRoute(app);
registerDemoRoute(app);
registerPortalRoute(app);

const port = Number(process.env.PORT ?? 4000);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${port}`);
  });
}

export default app;
