import Image from 'next/image';
import styles from './page.module.css';
import { RecipeForm } from '@/components/AddRecipeForm/AddRecipeForm';
import Container from '@/components/Container/Container';

export default function AddRecipe() {
  return (
    <Container>
      <RecipeForm />
    </Container>
  );
}
