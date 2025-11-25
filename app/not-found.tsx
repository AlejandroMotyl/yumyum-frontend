import css from './not-found.module.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '404 Not Found Page',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: 'Not Found Page',
    description: 'Sorry, the page you are looking for does not exist.',
    images: [
      {
        alt: 'YumYum Recipes',
        url: `/hero/hero-tablet.jpg`,
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.сontainerNotFound}>
      <picture>
        <source
          srcSet="/not-found/not-found-tablet-desktop.webp"
          media="(min-width: 768px)"
        />
        <Image
          src="/not-found/not-found-mobile.webp"
          alt="Not-found"
          width={361}
          height={267}
          priority
          className={css.notFoundImg}
        />
      </picture>
      <h1 className={css.notFoundTitle}>404</h1>
      <p className={css.notFoundDescription}>Recipe not found</p>
      <Link href="/" className={css.notFoundBackButton}>
        <svg stroke="var(--white)" width="24" height="24">
          <use href="/sprite-new.svg#icon-short-arrow-left-medium"></use>
        </svg>
        <p className={css.notFoundButtonDescription}>Back to Home</p>
      </Link>
    </div>
  );
}
