'use client';

import Image from 'next/image';
import css from './Header.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from '../Container/Container';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathURL = usePathname();
  if (!pathURL || pathURL.startsWith('/auth')) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  return (
    <header className={css.header}>
      <Container>
        <div className={css.headerContentContainer}>
          <Link href="/">
            <Image
              src="/logo.svg"
              width={165}
              height={46}
              alt="Logo"
              priority
            />
          </Link>
          <button
            className={css.burger}
            area-label="Open menu"
            type="button"
            aria-controls="main-navigation"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <div className={css.burger}>
              <svg stroke="var(--white)" width={32} height={32}>
                <use href="/sprite.svg#Genericburger" />
              </svg>
            </div>
          </button>

          {isMenuOpen && <div className={css.overlay} onClick={closeMenu} />}
          <nav
            id="main-navigation"
            className={`${css.navMenu} ${isMenuOpen ? css.navMenuOpen : ''}`}
            aria-label="Main navigation"
          >
            <ul>
              <li>
                <Link href="/">Recipes</Link>
              </li>
              <li>
                <Link href="/">Log in</Link>
              </li>
              <li>
                <Link href="/">Register</Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}
