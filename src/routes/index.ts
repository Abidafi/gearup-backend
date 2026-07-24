import { Router } from 'express';
import authRoutes from './auth.routes';
import gearRoutes from './gear.routes';
import rentalRoutes from './rental.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';
import categoryRoutes from './category.routes';
import reviewRoutes from './review.routes';
import providerRoutes from './provider.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/gear', gearRoutes);
rootRouter.use('/rentals', rentalRoutes);
rootRouter.use('/payments', paymentRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/categories', categoryRoutes);
rootRouter.use('/reviews', reviewRoutes);
rootRouter.use('/provider', providerRoutes);

export default rootRouter;