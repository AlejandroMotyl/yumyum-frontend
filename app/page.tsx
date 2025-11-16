//! For test, remove/modify once tested
'use client';
//! For test, remove/modify once tested

import Image from 'next/image';
import styles from './page.module.css';
import RecipesList from '@/components/RecipesList/RecipesList';
import Hero from '@/components/Hero/Hero';
import Filters from '@/components/Filters/Filters';

//! For test, remove/modify once tested
import { useState } from 'react';
import {
  categoryOptions,
  ingredientOptions,
} from '@/components/Filters/FiltersTestData';
import type { Option } from '@/types/filter';
//! For test, remove/modify once tested

export default function Home() {
  //! For test, remove/modify once tested
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const categories: Option[] = categoryOptions;
  const ingredients: Option[] = ingredientOptions;
  const totalRecipes = 96;
  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
  };
  //! For test, remove/modify once tested

  return (
    <>
      <Hero />
      <Filters
        totalRecipes={totalRecipes}
        categories={categories}
        ingredients={ingredients}
        selectedCategory={selectedCategory}
        selectedIngredient={selectedIngredient}
        onCategoryChange={setSelectedCategory}
        onIngredientChange={setSelectedIngredient}
        onReset={handleReset}
      />
      <RecipesList />
    </>
  );
}
