import Nango from "@nangohq/frontend";

export const createClient = () =>
  new Nango({ publicKey: process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY! });
