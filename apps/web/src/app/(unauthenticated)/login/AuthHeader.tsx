import Image from 'next/image';
import Link from 'next/link';

type HeaderProps = {
  heading: string;
  text: string;
  linkLabel: string;
  linkUrl: string;
};

export function AuthHeader({ heading, text, linkLabel, linkUrl }: HeaderProps) {
  return (
    <>
      <div className="flex justify-center">
        <Image alt="logo" src="/logo.svg" width={50} height={50} className="m-0" />
      </div>
      <h2 className="m-0 mt-5 text-center">{heading}</h2>
      <p className="text-center text-sm mt-2">
        {text}{' '}
        <Link href={linkUrl} className="font-medium text-primary">
          {linkLabel}
        </Link>
      </p>
    </>
  );
}
