import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5050,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    baseUrl: 'https://api.openai.com/v1',
  },
  // API kaliti yo'q bo'lsa — demo rejim (statik javoblar)
  get isMockMode() {
    return !this.openai.apiKey;
  },
};
