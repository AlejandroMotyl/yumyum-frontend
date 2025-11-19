import css from './ErrorMessage.module.css';

const ErrorMessage = () => {
  return (
    <div className={css.wrapper}>
      <img src="/Error.webp" alt="Error" className={css.hat} />
    </div>
  );
};

export default ErrorMessage;
