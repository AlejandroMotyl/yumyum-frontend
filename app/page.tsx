import Image from 'next/image';
import styles from './page.module.css';
import RecipesList from '@/components/RecipesList/RecipesList';
import Hero from '@/components/Hero/Hero';

export default function Home() {
  return (
    <>
      <Hero />
      <RecipesList />
    </>
  );
}
