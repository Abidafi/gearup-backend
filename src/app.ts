import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rootRouter from './routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { AppError } from './AppError';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', rootRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'GearUp Backend API is running smoothly!',
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `The requested route path ${req.originalUrl} does not exist on this server instance.`));
});

app.use(globalErrorHandler);

export default app;