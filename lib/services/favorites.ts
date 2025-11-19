import { api } from '../api/api';
import { useAuthStore } from '../store/authStore';

const { addSavedRecipe } = useAuthStore.getState();
const { removeSavedRecipe } = useAuthStore.getState();

export async function addFavoriteRecipe(recipeId: string) {
  await api.post(`/recipes/favorites/${recipeId}`);

  addSavedRecipe(recipeId);
}

export async function removeFavoriteRecipe(recipeId: string) {
  await api.delete(`/recipes/favorites/${recipeId}`);

  removeSavedRecipe(recipeId);
}
