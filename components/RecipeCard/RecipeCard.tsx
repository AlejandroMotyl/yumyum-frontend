export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <div>
      <img src={recipe.thumb} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
    </div>
  );
}
