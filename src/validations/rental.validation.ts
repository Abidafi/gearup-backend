import { z } from 'zod';

export const createRentalSchema = z.object({
  body: z.object({
    gearItemId: z.string().uuid('Valid Gear Item target identity mapping required'),
    startDate: z.string().datetime('ISO Start date required format strings'),
    endDate: z.string().datetime('ISO End date required format strings'),
  }),
});