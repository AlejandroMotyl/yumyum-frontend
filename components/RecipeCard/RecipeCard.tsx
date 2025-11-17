'use client';

import { useState } from 'react';
import Image from 'next/image';
import css from './RecipeCard.module.css';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import FavoriteIcon from '../FavoriteIcon/FavoriteIcon';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      <Image
        src={recipe?.thumb ? recipe.thumb : '/img-default/default-img-tablet'}
        alt={recipe.title}
        width={300}
        height={300}
        className={css.img}
      />

      <div className={css.titleWrapper}>
        <h2 className={css.title}>{recipe.title}</h2>
        <div className={css.timeWrapper}>
          <Image
            src="/icons/clock.svg"
            alt="Time"
            width={15}
            height={15}
            className={css.timeIcon}
          />
          <span className={css.recipeTime}>{recipe.time}</span>
        </div>
      </div>

      <div className={css.descriptionWrapper}>
        <p className={css.description}>{recipe.description}</p>
        <p className={css.descriptionCals}>~{recipe.cals} cals</p>
      </div>

      <div className={css.buttonWrapper}>
        <Link href={'/'} className={css.button}>
          Learn more
        </Link>

        <button
          className={`${css.favoriteButton} ${isFavorite ? css.active : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <FavoriteIcon filled={isFavorite} className={css.favoriteIcon} />
        </button>
      </div>
    </>
  );
}
