export type WithClassName<T> = T & { className?: string };

export type Variant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'ghost'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type Size = 'lg' | 'md' | 'sm' | 'xs';
