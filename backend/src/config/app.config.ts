const parsePort = (value: string | undefined, fallback: number) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
};

export default () => ({
  nodeEnv: process.env.NODE_ENV?.trim() || 'development',
  app: {
    name: 'FreshBitan API',
    port: parsePort(process.env.PORT, 4000),
    apiPrefix: 'api',
    frontendUrl: process.env.FRONTEND_URL?.trim() || 'http://localhost:3000',
  },
  auth: {
    jwtSecret: (() => {
      const jwtSecret = process.env.JWT_SECRET?.trim();
      const nodeEnv = process.env.NODE_ENV?.trim() || 'development';

      if (!jwtSecret) {
        if (nodeEnv === 'production') {
          throw new Error('JWT_SECRET is required in production.');
        }

        return 'development-only-jwt-secret-change-me';
      }

      return jwtSecret;
    })(),
  },
  database: {
    url: process.env.DATABASE_URL?.trim() || '',
    synchronize: parseBoolean(process.env.DB_SYNCHRONIZE, false),
    logging: parseBoolean(process.env.DB_LOGGING, false),
    ssl:
      process.env.DB_SSL_MODE?.trim().toLowerCase() === 'disable'
        ? false
        : {
            rejectUnauthorized: false,
          },
  },
});
