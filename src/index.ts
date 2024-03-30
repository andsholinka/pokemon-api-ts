import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import apiRouter from './routers';

dotenv.config();
const app = express();

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));

const Port = process.env.APP_PORT || 8080;

app.use('/api', apiRouter);

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
})

app.listen(Port, () => {
    console.log(['Info'], `${process.env.APP_NAME}`, `Server started on port ${Port}`);
});