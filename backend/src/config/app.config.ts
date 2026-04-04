const parsePort = (value: string | undefined, fallback: number) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

export default () => ({
  app: {
    name: 'FreshBitan API',
    port: parsePort(process.env.PORT, 4000),
    apiPrefix: 'api',
    frontendUrl: process.env.FRONTEND_URL?.trim() || 'http://localhost:3000',
  },
  auth: {
    jwtSecret:
      process.env.JWT_SECRET?.trim() || 'replace-with-a-long-random-secret',
  },
  database: {
    url: process.env.DATABASE_URL?.trim() || '',
  },
});
