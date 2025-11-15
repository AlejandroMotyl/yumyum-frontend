'use client';

import { MouseEvent, useState } from 'react';
import Image from 'next/image';
import css from './Footer.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Container from '../Container/Container';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

export default function Footer() {
  const pathURL = usePathname();
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showModal, setShowModal] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleAccountClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      setShowModal(true);
    }
  };

  return (
    <footer className={css.footer}>
      <Container>
        <nav className={css.footerNav}>
          <Link href="/">
            <Image
              src="/logo.svg"
              width={165}
              height={46}
              alt="Logo"
              priority
            />
          </Link>

          <div id="copyright" className={css.footerCopyright}>
            <span>&copy;</span> {currentYear} CookingCompanion. All rights
            reserved.
          </div>

          <div className={css.footerLinksContainer}>
            <Link href="/" className={css.footerLink}>
              Recipes
            </Link>

            {!pathURL.startsWith('/auth') && (
              <button
                type="button"
                className={css.footerLink}
                onClick={handleAccountClick}
              >
                Account
              </button>
            )}
          </div>
        </nav>
        {showModal && (
          <ConfirmationModal
            title="Login Required"
            confirmButtonText="Login"
            cancelButtonText="Cancel"
            onConfirm={() => {
              setShowModal(false);
              router.push('/auth/login');
            }}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Container>
    </footer>
  );
}
