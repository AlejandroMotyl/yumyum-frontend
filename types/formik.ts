import { Category, Ingredient } from '@/types/recipe';

export interface SelectOption {
  value: string;
  label: string;
  data: Category | Ingredient;
}

export interface FormikSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder: string;
  width?: string;
}
