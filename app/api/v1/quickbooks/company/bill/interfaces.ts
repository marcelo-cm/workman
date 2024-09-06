import { z } from 'zod';

import { BillSchema, LineItemSchema } from './constants';

export type Bill = z.infer<typeof BillSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
