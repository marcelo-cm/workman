import OpenAI from 'openai';

export const createClient = () => {
  return new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    // organization: 'org-4d7JFjxj4gLYbA7EaZJeNKdZ',
    // project: 'proj_GjOAlSbK7Ks6ZwXoJEMMSmlN',
  });
};
