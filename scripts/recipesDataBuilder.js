import { recipes } from "../data/recipes.js";

export const getRecipes = () =>
  recipes.map((recipe) => ({
    ...recipe,
    ingredientsLabelsList: recipe.ingredients.map((ingredient) =>
      ingredient.ingredient.toLowerCase()
    ),
    ingredientsAsString: recipe.ingredients
      .map((ingredient) => ingredient.ingredient.toLowerCase())
      .join(" "),
    ustensilsLabelsList: recipe.ustensils.map((ustensil) =>
      ustensil.toLowerCase()
    ),
  }));
