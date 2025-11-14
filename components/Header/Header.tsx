'use client';

import Image from 'next/image';
import css from './Header.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Container from '../Container/Container';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

export default function Header() {
  const { isAuthenticated, clearIsAuthenticated, user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathURL = usePathname();
  if (!pathURL || pathURL.startsWith('/auth')) return null;
  const firstLetterUserName = user?.name ? [...user.name][0] : '';
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push('/');
    } catch (error) {
      console.log('Logout failed: ', error);
    }
  };

  return (
    <header className={css.header}>
      <Container>
        <div className={css.headerContentContainer}>
          <Link className={css.logo} href="/">
            <Image
              src="/logo.svg"
              width={165}
              height={46}
              alt="Logo"
              loading="eager"
            />
          </Link>
          <button
            className={css.burger}
            aria-label="Open menu"
            type="button"
            aria-controls="main-navigation"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <svg
              stroke="var(--white)"
              width={32}
              height={32}
              className={isMenuOpen ? css.closeIcon : ''}
            >
              <use
                href={
                  isMenuOpen
                    ? '/sprite.svg#icon-Genericclose'
                    : '/sprite.svg#icon-Genericburger-regular'
                }
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div
              aria-hidden="true"
              className={css.overlay}
              onClick={closeMenu}
            />
          )}
          <nav
            id="main-navigation"
            className={`${css.navMenu} ${isMenuOpen ? css.navMenuOpen : ''}`}
            aria-label="Main navigation"
          >
            <ul>
              <li>
                <Link href="/recipes">Recipes</Link>
              </li>
              <li>
                {isAuthenticated ? (
                  <Link href="/profile">My Profile</Link>
                ) : (
                  <Link href="/auth/login">Log in</Link>
                )}
              </li>
              {isAuthenticated ? (
                <>
                  <li className={css.userInfo}>
                    <span className={css.avatar}>{firstLetterUserName}</span>
                    <span className={css.userName}>{user?.name}</span>
                  </li>
                  <li className={css.logoutItem}>
                    <button
                      className={css.logoutButton}
                      onClick={handleLogout}
                      aria-label="Log out"
                    >
                      <svg stroke="var(--white)" width={24} height={24}>
                        <use href="/sprite.svg#icon-Genericlog-out" />
                      </svg>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className={`${css.register}, ${css.btnRegisterReceipes}`}
                    aria-label="Register"
                  >
                    Register
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}
