import css from './loading.module.css';

export default function Loading() {
  return (
    <div className={css.loadingBackground}>
      <div className={css.loadingBackdrop}>
        <img
          src="/acartoon-stylechef.webp"
          alt="Chef Hat"
          className={css.hat}
        />
      </div>
    </div>
  );
}
