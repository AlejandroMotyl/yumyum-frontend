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
  selectedSort: string;
  onCategoryChange: (value: string) => void;
  onIngredientChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export interface getCategoriesProps {
  _id: string;
  name: string;
}

export interface getIngredientsProps {
  _id: string;
  name: string;
}

export const sortOptions: Option[] = [
  { value: 'time', label: 'Cooking time' },
  { value: 'cals', label: 'Caloric content' },
  { value: 'popularity', label: 'Popular' },
];

export interface CustomSelectProps {
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  name: string;
}
