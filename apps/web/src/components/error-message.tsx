import { Size, WithClassName } from '../types/styles';

type ErrorMessageProps = WithClassName<{
  children: string;
  size?: Size;
}>;

export function ErrorMessage({ children, size = 'sm', className }: ErrorMessageProps) {
  return <p className={`my-1 text-${size} text-red-700 ${className}`}>{children}</p>;
}
