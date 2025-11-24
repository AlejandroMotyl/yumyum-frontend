export interface RecipeIngredient {
  id: string;
  measure: string;
}
export type AnyRecipe = Recipe | RecipeFavorite;

export interface Recipe {
  _id: string;
  title: string;
  category: string;
  area?: string;
  instructions: string;
  description: string;
  thumb?: string;
  time: number;
  cals?: number;
  owner: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFavorite {
  _id: string;
  title: string;
  category: string;
  area?: string;
  instructions: string;
  description?: string;
  thumb?: string;
  time: number;
  cals?: number;
  owner: {
    _id: string;
    avatar: string | null;
    email: string;
  };
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Ingredient {
  _id: string;
  name: string;
}

export interface IngredientValue {
  id: string;
  name: string;
  amount: string;
}

export interface RecipeFormValues {
  title: string;
  description: string;
  time: string;
  cals?: string;
  category: string;
  ingredients: IngredientValue[];
  instructions: string;
  thumb?: File | null;
}
