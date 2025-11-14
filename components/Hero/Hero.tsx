import Container from '../Container/Container';
import css from './Hero.module.css';

const Hero = () => {
  return (
    <section className={css.heroSection}>
      <div className={css.overlay}>
        <Container>
          <div className={css.heroWrapper}>
            <div className={css.tittleWrapper}>
              <h1 className={css.title}>Plan, Cook, and Share Your Flavors</h1>
            </div>

            <form className={css.heroForm}>
              <input className={css.heroInput} type="text" />
              <button className={css.heroBtn} type="submit">
                Search
              </button>
            </form>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
