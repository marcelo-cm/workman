import * as mindee from 'mindee';

export function createMindeeClient() {
  return new mindee.Client({ apiKey: process.env.MINDEE });
}
