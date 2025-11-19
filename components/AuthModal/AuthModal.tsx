'use client';

import Modal from '../Modal/Modal';
import css from './AuthModal.module.css';

interface Props {
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function AuthModal({ onClose, onLogin, onRegister }: Props) {
  return (
    <Modal onClose={onClose} className={css.auth_modal}>
      <h2 className={css.title}>Error while saving</h2>
      <p className={css.text}>
        To save this recipe, you need to authorize first
      </p>
      <div className={css.btn_container}>
        <button className={css.login_btn} type="button" onClick={onLogin}>
          Log in
        </button>
        <button className={css.register_btn} type="button" onClick={onRegister}>
          Register
        </button>
      </div>
    </Modal>
  );
}
