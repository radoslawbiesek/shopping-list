export function getEnvVariable(name: 'PORT'): number;
export function getEnvVariable(name: 'NODE_ENV'): 'development' | 'test';
export function getEnvVariable(name: 'BCRYPT_SALT_OR_ROUNDS'): string | number;
export function getEnvVariable(name: 'JWT_SECRET'): string;
export function getEnvVariable(name: 'JWT_EXPIRES_IN'): string;
export function getEnvVariable(name: 'VERSION'): string;
export function getEnvVariable(name: string): number | string | undefined {
  let value = process.env[name];

  if (process.env['NODE_ENV'] === 'test') {
    value = process.env[`TEST_${name}`] || value;
  }

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
    case 'VERSION':
      return '0.0.0';
  }

  return value;
}
