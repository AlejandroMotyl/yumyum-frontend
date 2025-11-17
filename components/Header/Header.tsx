'use client';

import Image from 'next/image';
import css from './Header.module.css';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Container from '../Container/Container';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

export default function Header() {
  const { isAuthenticated, clearIsAuthenticated, user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const firstLetterUserName = user?.name ? [...user.name][0] : '';
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push('/');
      closeMenu();
    } catch (error) {
      console.log('Logout failed: ', error);
    }
  };
  //no scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

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
            ></div>
          )}
          <nav
            id="main-navigation"
            className={`${css.navMenu} ${isMenuOpen ? css.navMenuOpen : ''}`}
            aria-label="Main navigation"
          >
            <div className={css.logoCloseBtnContainer}>
              <Link
                className={`${css.logoInMenuOpen}`}
                href="/"
                onClick={closeMenu}
              >
                <Image
                  src="/logo.svg"
                  width={165}
                  height={46}
                  alt="Logo"
                  loading="eager"
                />
              </Link>
            </div>
            <ul className={`${isMenuOpen}? ${css.ulContainer} : ''`}>
              <li
                className={`${css.text} ${css.recipesLink}  ${pathname === '/' ? css.activeUnderLine : ''}`}
              >
                <Link href="/" onClick={closeMenu}>
                  Recipes
                </Link>
              </li>
              <li
                className={`${css.text}  ${pathname === '/profile' || pathname === '/auth/login' ? css.activeUnderLine : ''}`}
              >
                {isAuthenticated ? (
                  <Link href="/profile" onClick={closeMenu}>
                    My Profile
                  </Link>
                ) : (
                  <Link href="/auth/login" onClick={closeMenu}>
                    Log in
                  </Link>
                )}
              </li>
              {isAuthenticated ? (
                <>
                  <li className={css.userInfo}>
                    <span className={css.avatar}>{firstLetterUserName}</span>
                    <span className={css.userName}>{user?.name}</span>
                    <span className={css.line} />
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
                  <li>
                    <button
                      className={`${css.btnRegisterReceipes} ${css.changeOrderOnTablet}`}
                      onClick={() => {
                        router.push('/add-recipe');
                        closeMenu();
                      }}
                      aria-label="Add Recipe"
                    >
                      Add Recipe
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className={css.btnRegisterReceipes}
                    onClick={() => {
                      router.push('/auth/register');
                      closeMenu();
                    }}
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
