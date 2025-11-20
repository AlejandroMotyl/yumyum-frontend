import { addToFavorite, removeFromFavorite } from '../api/clientApi';
import { useAuthStore } from '../store/authStore';

const { addSavedRecipe } = useAuthStore.getState();
const { removeSavedRecipe } = useAuthStore.getState();

export async function addFavoriteRecipe(recipeId: string) {
  addSavedRecipe(recipeId);
  return addToFavorite({ recipeId });
}

export async function removeFavoriteRecipe(recipeId: string) {
  removeSavedRecipe(recipeId);
  return removeFromFavorite({ recipeId });
}
