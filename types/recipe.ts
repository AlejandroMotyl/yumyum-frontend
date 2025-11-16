export interface RecipeIngredient {
  id: string;
  measure: string;
}

export interface Recipe {
  _id: string;
  title: string;
  category: string;
  area?: string;
  instructions: string;
  description?: string;
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
