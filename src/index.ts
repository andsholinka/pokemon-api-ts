import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import apiRouter from './routers';

dotenv.config();
const app = express();
const Port = process.env.APP_PORT || 8080;

app.use('/api', apiRouter);

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
})

app.listen(Port, () => {
    console.log(['Info'], `${process.env.APP_NAME}`, `Server started on port ${Port}`);
});