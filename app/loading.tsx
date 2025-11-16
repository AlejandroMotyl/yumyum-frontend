import css from './loading.module.css';

export default function Loading() {
  return (
    <div className={css.loadingBackground}>
      <div className={css.loadingBackdrop}>
        <img
          src="/a cartoon-style chef.webp"
          alt="Chef Hat"
          className={css.hat}
        />
      </div>
    </div>
  );
}
