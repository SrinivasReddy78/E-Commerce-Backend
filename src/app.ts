import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import router from './router/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constant/responseMessage';
import httpError from './util/httpError';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/config';
import userRouter from './router/authRouter';

const app: Application = express();
const baseRouter = express.Router()

// Middlewares
app.use(helmet());
app.use(cors({
    origin: [config.FRONTEND_URL as string],
    credentials: true,
}))
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));
app.use('/api/v1', baseRouter)


// routes
baseRouter.use('/', router);
baseRouter.use('/user', userRouter);

// 404 Handler
app.use((req: Request, _:Response, next: NextFunction)=>{
    try {
        throw new Error(responseMessage.NOT_FOUND('route'));

    } catch (error) {
        httpError(next, error, req, 404)
    }
})

// Global Error Handler
app.use(globalErrorHandler);

export default app