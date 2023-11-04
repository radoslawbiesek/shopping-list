import { Button, ButtonProps } from '@nextui-org/react';

type ServerActionButtonProps = Omit<ButtonProps, 'type'> & {
  action: () => Promise<unknown>;
};

export function ServerActionButton({ action, ...props }: ServerActionButtonProps) {
  return (
    <form className="flex items-center justify-center" action={action}>
      <Button {...props} type="submit">
        {props.children}
      </Button>
    </form>
  );
}
