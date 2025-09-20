import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { registerHealthRoute } from './routes/health.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

registerHealthRoute(app);

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});

export default app;
