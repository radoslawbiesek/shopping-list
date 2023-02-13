import classNames from 'classnames';

import { Size, Variant, WithClassName } from '../../types/styles';

type ButtonProps = React.ComponentProps<'button'> &
  WithClassName<{
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    outline?: boolean;
    loading?: boolean;
  }>;

export function Button({
  variant,
  size,
  outline,
  loading,
  disabled,
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'btn',
        { [`btn-${variant}`]: variant },
        { [`btn-${size}`]: size },
        { 'btn-outline': outline },
        { loading: loading },
        { 'btn-disabled': disabled },
        { 'btn-block': fullWidth },
        className,
      )}
      {...rest}
    />
  );
}
