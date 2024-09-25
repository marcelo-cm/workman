import { Nango } from '@nangohq/node';

export const createServerClient = () =>
  new Nango({
    secretKey: process.env.NANGO_SECRET_KEY!,
  });
