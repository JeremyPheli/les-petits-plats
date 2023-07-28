export class RecipeCard {
  constructor(recipe) {
    this.image = recipe.image;
    this.name = recipe.name;
    this.time = recipe.time;
    this.description = recipe.description;
    this.ingredients = recipe.ingredients;
  }

  shortenUnit() {
    const newUnits = this.ingredients.map((ingredient) => {
      switch (ingredient.unit) {
        case "grammes":
          return "g";
        case "cuillères à soupe":
          return "cuillères";
        default:
          return ingredient.unit;
      }
    });
    return newUnits;
  }

  createIngredientsList() {
    const ingredientDomElements = this.ingredients.map((ingredient) => {
      if (ingredient.quantity === undefined && ingredient.unit === undefined) {
        return `<li>${ingredient.ingredient}</li>`;
      }
      if (ingredient.unit === undefined) {
        return `<li>${ingredient.ingredient} <span class="card__quantity">${ingredient.quantity}</span></li>`;
      }
      return `<li>${ingredient.ingredient} <span class="card__quantity">${ingredient.quantity} ${ingredient.unit}</span></li>`;
    });
    return ingredientDomElements.join("");
  }

  createCard() {
    return `
      <div class="card">
          <div class="card__image">
          <span class="card__time">${this.time}min</span>
            <img 
              class="img__card"
              src="./assets/img/${this.image}"
              alt"images recipes"
            />
          </div>
          <div class="card__body">
              <div class="card__header">
                <h2 class="card__title">${this.name}</h2>
              </div>
              <p class="card__recipe">Recette</p>
              <div class="card__main">
                  <p class="card__description">${this.description}</p>
                <p class="card__ingredients__title">Ingredients</p>
                  <ul class="card__ingredients">
                      ${this.createIngredientsList()}
                  </ul>
              </div>
          </div>
      </div>
      `;
  }
}
