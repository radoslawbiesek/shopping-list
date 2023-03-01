import Link from 'next/link';

import classNames from 'classnames';

import { WithClassName } from '../../../types/styles';

type CardProps = WithClassName<{
  title: string;
  description?: string;
  buttonLabel?: string;
  href: string;
}>;

export function Card({ title, description, className, buttonLabel, href }: CardProps) {
  return (
    <div className={classNames('card card-compact w-96 bg-white shadow-md', className)}>
      <div className="card-body flex flex-row items-center">
        <div className="flex-1">
          <h4 className="card-title text-md">{title}</h4>
          <p>{description}</p>
        </div>
        <div className="card-actions justify-end">
          <Link href={href}>
            <button className="btn btn-circle btn-outline btn-sm btn-primary">
              <span className="text-xl">{buttonLabel}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
