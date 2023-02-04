export function getEnvVariable(name: 'PORT'): number;
export function getEnvVariable(name: 'NODE_ENV'): 'development';
export function getEnvVariable(name: 'BCRYPT_SALT_OR_ROUNDS'): string | number;
export function getEnvVariable(name: 'JWT_SECRET'): string;
export function getEnvVariable(name: 'JWT_EXPIRES_IN'): string;
export function getEnvVariable(name: string): number | string | undefined {
  const value = process.env[name];
  switch (name) {
    case 'NODE_ENV':
      return value || 'development';
    case 'PORT':
      return value ? parseInt(value) : 3000;
    case 'BCRYPT_SALT_OR_ROUNDS':
      if (!value) return 10;
      return Number.isNaN(parseInt(value)) ? value : parseInt(value);
    case 'JWT_SECRET':
      return value || 'secret';
    case 'JWT_EXPIRES_IN':
      return value || '8h';
  }

  return value;
}
