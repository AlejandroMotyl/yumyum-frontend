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
              <Link
                aria-label="Close menu"
                aria-controls="main-navigation"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
                href=""
              >
                <svg
                  stroke="var(--white)"
                  width={32}
                  height={32}
                  className={css.closeIcon}
                >
                  <use href={'/sprite.svg#icon-Genericclose'} />
                </svg>
              </Link>
            </div>

            <ul>
              <li
                className={`${css.recipeProfileLinks} ${pathname === '/' ? css.activeUnderLine : ''}`}
              >
                <Link
                  className={`${css.text} ${isAuthenticated ? css.mb8 : css.recipesLink}`}
                  href="/recipes"
                  onClick={closeMenu}
                >
                  Recipes
                </Link>
                {isAuthenticated && (
                  <Link
                    className={`${css.myProfileLink} ${css.text}`}
                    href="/profile"
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
                    <Link
                      className={css.logoutLink}
                      onClick={handleLogout}
                      aria-label="Log out"
                      href="/"
                    >
                      <svg
                        fill="transparent"
                        stroke="var(--white)"
                        width={24}
                        height={24}
                      >
                        <use href="/sprite.svg#icon-Genericlog-out" />
                      </svg>
                    </Link>
                  </div>

                  <button
                    className={`${css.btnRegisterRecipes} ${css.changeOrderOnTablet}`}
                    onClick={() => {
                      router.push('/add-recipe');
                      closeMenu();
                    }}
                    aria-label="Add Recipe"
                  >
                    Add Recipe
                  </button>
                </li>
              ) : (
                <li>
                  <div className={css.loginRegisterContainer}>
                    <Link
                      className={css.login}
                      href="/auth/login"
                      onClick={closeMenu}
                    >
                      Log in
                    </Link>
                    <button
                      className={css.btnRegisterRecipes}
                      onClick={() => {
                        router.push('/auth/register');
                        closeMenu();
                      }}
                      aria-label="Register"
                    >
                      Register
                    </button>
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
