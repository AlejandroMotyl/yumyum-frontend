import { RecipeFormValues } from '@/types/recipe';

export const initialValues: RecipeFormValues = {
  title: '',
  description: '',
  time: '',
  cals: '',
  category: '',
  ingredients: [{ id: '', name: '', amount: '' }],
  instructions: '',
  thumb: null,
};
