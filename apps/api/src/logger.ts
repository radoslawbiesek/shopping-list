import { config } from './config';

export const logger = (() => {
  if (config.nodeEnv === 'test') {
    return false;
  }

  if (config.nodeEnv === 'development') {
    return { level: 'debug', transport: { target: 'pino-pretty' } };
  }

  // production
  return { level: 'info' };
})();
