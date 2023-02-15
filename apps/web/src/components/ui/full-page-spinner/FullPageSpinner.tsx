import { Spinner } from '../spinner/Spinner';

export function FullPageSpinner() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner className="w-36 h-36" />
    </div>
  );
}
