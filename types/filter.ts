export interface Option {
  value: string;
  label: string;
}

export interface FilterProps {
  totalRecipes: number;
  categories: Option[];
  ingredients: Option[];
  selectedCategory: string;
  selectedIngredient: string;
  onCategoryChange: (value: string) => void;
  onIngredientChange: (value: string) => void;
  onReset: () => void;
}
