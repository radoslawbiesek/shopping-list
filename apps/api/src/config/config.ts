export function getConfig(name: 'PORT'): number;
export function getConfig(name: 'NODE_ENV'): 'development';
export function getConfig(name: string): number | string | undefined {
  const value = process.env[name];
  switch (name) {
    case 'NODE_ENV':
      return value || 'development';
    case 'PORT':
      return value ? parseInt(value) : 3000;
  }

  return value;
}
