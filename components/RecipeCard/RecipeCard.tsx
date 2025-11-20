'use client';

import { useState } from 'react';
import Image from 'next/image';
import css from './RecipeCard.module.css';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      <Image
        src={
          recipe?.thumb ? recipe.thumb : '/img-default/default-img-desktop.jpg'
        }
        alt={recipe.title}
        width={300}
        height={300}
        className={css.img}
      />

      <div className={css.titleWrapper}>
        <h2 className={css.title}>{recipe.title}</h2>
        <div className={css.timeWrapper}>
          <svg className={css.timeIcon} width="15" height="15">
            <use href="/sprite.svg#clock"></use>
          </svg>
          <span className={css.recipeTime}>{recipe.time}</span>
        </div>
      </div>

      <div className={css.descriptionWrapper}>
        <p className={css.description}>{recipe.description}</p>
        <p className={css.descriptionCals}>~{recipe.cals} cals</p>
      </div>

      <div className={css.buttonWrapper}>
        <Link href={`/recipes/${recipe._id}`} className={css.button}>
          Learn more
        </Link>

        <button
          className={`${css.favoriteButton} ${isFavorite ? css.active : ''}`}
          onClick={(e) => {
            e.currentTarget.blur();
            setIsFavorite(!isFavorite);
          }}
          type="button"
        >
          <svg className={css.favoriteIcon} width="14" height="17">
            <use href={`/sprite.svg#favorite`}></use>
          </svg>
        </button>
      </div>
    </>
  );
}
