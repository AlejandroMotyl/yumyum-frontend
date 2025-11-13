'use client';

import Image from 'next/image';

import css from './Header.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathURL = usePathname();
  if (!pathURL || pathURL.startsWith('/auth')) return null;
  return (
    <header className={css.header}>
      <nav className={css.headerNav}>
        <Link href="/">
          <Image src="/logo.svg" width={165} height={46} alt="Logo" priority />
        </Link>
        {/* <button
            type="button"
            className={css.burgerBtn}
            area-laber="Open menu"
            aria-controls="app-sidebar"
            aria-expanded={open}
          > */
        /* <GiHamburgerMenu className={css.burgerIcon} size={32} /> */}
        {/* </button> */}
      </nav>
    </header>
  );
}
