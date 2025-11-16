import css from './Loader.module.css';

const Loader = () => {
  return (
    <div className={css.wrapper}>
      <img src="/a-cartoon-style-chef.svg" alt="Chef Hat" className={css.hat} />
    </div>
  );
};

export default Loader;
