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
  const firstLetterUserName = user?.name?.[0]?.toUpperCase() ?? '';
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      closeMenu();
      router.push('/');
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
          {/*mobile logo & burger*/}
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
            <svg stroke="var(--white)" width={32} height={32}>
              <use href={'/sprite.svg#icon-Genericburger-regular'} />
            </svg>
          </button>
          {/*overlay*/}
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
            {/*mobile logo & close btn*/}
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
              <button
                aria-label="Close menu"
                aria-controls="main-navigation"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                <svg
                  stroke="var(--white)"
                  width={32}
                  height={32}
                  className={css.closeIcon}
                >
                  <use href={'/sprite.svg#icon-Genericclose'} />
                </svg>
              </button>
            </div>

            <ul>
              <li className={css.recipeProfileLinks}>
                <Link
                  className={`${css.text} ${isAuthenticated ? css.mb8 : css.recipesLink} ${pathname === '/' ? css.activeUnderLine : ''}`}
                  href="/"
                  onClick={closeMenu}
                >
                  Recipes
                </Link>
                {isAuthenticated && (
                  <Link
                    className={`${css.myProfileLink} ${css.text} ${pathname === '/profile/own' ? css.activeUnderLine : ''}`}
                    href="/profile/own"
                    onClick={closeMenu}
                  >
                    My Profile
                  </Link>
                )}
              </li>
              {isAuthenticated ? (
                <li className={css.userInfoContainer}>
                  <div className={css.userInfo}>
                    <div className={css.avatarNameContainer}>
                      <span className={css.avatar}>{firstLetterUserName}</span>
                      <span className={css.userName}>{user?.name}</span>
                    </div>
                    <span className={css.line} />
                    <button
                      className={css.logoutLink}
                      onClick={handleLogout}
                      aria-label="Log out"
                    >
                      <svg
                        fill="transparent"
                        stroke="var(--white)"
                        width={24}
                        height={24}
                      >
                        <use href="/sprite.svg#icon-Genericlog-out" />
                      </svg>
                    </button>
                  </div>

                  <Link
                    className={`${css.linkRegisterRecipes} ${css.changeOrderOnTablet}`}
                    onClick={() => {
                      closeMenu();
                    }}
                    aria-label="Add Recipe"
                    href="/add-recipe"
                  >
                    Add Recipe
                  </Link>
                </li>
              ) : (
                <li>
                  <div className={css.loginRegisterContainer}>
                    <Link
                      className={`${css.login} ${css.text} ${pathname === '/auth/login' ? css.activeUnderLine : ''}`}
                      href="/auth/login"
                      onClick={closeMenu}
                    >
                      Log in
                    </Link>
                    <Link
                      className={css.linkRegisterRecipes}
                      onClick={() => {
                        closeMenu();
                      }}
                      aria-label="Register"
                      href="/auth/register"
                    >
                      Register
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}
