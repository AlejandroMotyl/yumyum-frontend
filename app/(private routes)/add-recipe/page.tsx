import Image from 'next/image';
import css from './page.module.css';
import { RecipeForm } from '@/components/AddRecipeForm/AddRecipeForm';
import Container from '@/components/Container/Container';
import { Metadata } from 'next';
import { generateMetadataGlobal } from '@/utils/generateMetadataGlobal';

export async function generateMetadata(): Promise<Metadata> {
  const title = `YumYum Add Recipe`;
  const description = `Create your own recipe at YumYum`;
  return generateMetadataGlobal({
    title,
    description,
    image: {
      url: 'hero/hero-tablet.jpg',
      alt: title,
    },
  });
}

export default function AddRecipe() {
  return (
    <Container>
      <div className={css.addRecipeMain}>
        <div className={css.addRecipeForm}>
          <RecipeForm />
        </div>
      </div>
    </Container>
  );
}
