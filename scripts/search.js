import { RecipeCard } from "./templates/RecipeCard.js";
import { $recipeGrid, recipesDomElements } from "./grid.js";
import {
  updateDropdownList,
  $dropdownListIngredients,
  $dropdownListAppliances,
  $dropdownListUtensils,
} from "./dropdown.js";
import { getRecipes } from "./recipesDataBuilder.js";
import { userSearch } from "./userSearch.js";

// DOM
const searchBar = document.querySelector(".search-header");
const $tagsContainer = document.querySelector(".search__tags");
const selectTagsIngredients = document.getElementById("list-ingredients");
const selectTagsAppliances = document.getElementById("list-appliances");
const selectTagsUtensils = document.getElementById("list-utensils");
const totalRecipes = document.querySelector(".total__recipes");

const recipes = getRecipes();

totalRecipes.innerHTML = recipes.length + " recettes ";

let results = [];
let resultatsWithTag = [];
let alreadyFilterWithTag = false;

// Système de recherche
export function mainSearch() {
  const totalRecipes = document.querySelector(".total__recipes");
  searchBar.addEventListener("input", (e) => {
    userSearch.main = e.target.value.toLowerCase();
    if (userSearch.main.trim().length >= 3) {
      if (alreadyFilterWithTag) {
        results = retrieveMatchingRecipes(resultatsWithTag, userSearch.main);
      } else {
        // No tag
        results = retrieveMatchingRecipes(recipes, userSearch.main);
      }
      if (results.length > 0) {
        showResult(results);
        updateDropdownList(results);
      } else {
        totalRecipes.innerHTML = results.length + " recettes ";
        showNoResultMessage();
      }
    } else if (userSearch.main.length < 3) {
      totalRecipes.innerHTML = results.length + " recettes ";
      displayAllRecipesAndDropdownList();
      totalRecipes.innerHTML = recipes.length + " recettes ";
    } else if (
      userSearch.ingredients.length > 0 ||
      userSearch.appliances.length > 0 ||
      userSearch.ustensils.length > 0
    ) {
      results = [];
      searchAndShowRecipesWithTag(recipes);
    } else {
      results = [];
      displayAllRecipesAndDropdownList();
    }
  });

  // Listener on ingredients dropdown
  selectTagsIngredients.addEventListener("click", () => {
    actionWhenADropdownItemIsClicked();
  });
  // Listener on appliances dropdown
  selectTagsAppliances.addEventListener("click", () => {
    actionWhenADropdownItemIsClicked();
  });
  // Listener on utensils dropdown
  selectTagsUtensils.addEventListener("click", () => {
    actionWhenADropdownItemIsClicked();
  });
  // Listener on a tag
  $tagsContainer.addEventListener("click", () => {
    if (userSearch.main.length >= 3) {
      if (
        userSearch.ingredients.length > 0 ||
        userSearch.appliances.length > 0 ||
        userSearch.ustensils.length > 0
      ) {
        results = retrieveMatchingRecipes(recipes, userSearch.main);
        searchAndShowRecipesWithTag(results);
        // console.log(userSearch)
        if (resultatsWithTag.length < 1) {
          showNoResultMessage();
        }
      } else {
        alreadyFilterWithTag = false;
        results = retrieveMatchingRecipes(recipes, userSearch.main);
        showResult(results);
        updateDropdownList(results);
      }
    } else if (
      userSearch.ingredients.length > 0 ||
      userSearch.appliances.length > 0 ||
      userSearch.ustensils.length > 0
    ) {
      searchAndShowRecipesWithTag(recipes);
    } else {
      alreadyFilterWithTag = false;
      displayAllRecipesAndDropdownList();
    }
  });
}

function actionWhenADropdownItemIsClicked() {
  // console.log({ userSearch, results, resultatsWithTag, recipes })
  if (results.length > 0) {
    searchAndShowRecipesWithTag(results);
  } else {
    searchAndShowRecipesWithTag(recipes);
  }
}

/**
 * Recherche les recettes avec uniquement les tags
 * @param {Recipe[]} arr - tableau de recettes
 */
function searchAndShowRecipesWithTag(arr) {
  alreadyFilterWithTag = false;
  if (userSearch.ingredients.length > 0) {
    resultatsWithTag = arr.filter((recipe) =>
      userSearch.ingredients.every((ingredient) =>
        recipe.ingredientsLabelsList.includes(ingredient)
      )
    );
    alreadyFilterWithTag = true;
  }
  if (userSearch.appliances.length > 0) {
    if (alreadyFilterWithTag) {
      resultatsWithTag = resultatsWithTag.filter((recipe) =>
        userSearch.appliances.every(
          (appliance) => appliance === recipe.appliance.toLowerCase()
        )
      );
    } else {
      resultatsWithTag = arr.filter((recipe) =>
        userSearch.appliances.every(
          (appliance) => appliance === recipe.appliance.toLowerCase()
        )
      );
      alreadyFilterWithTag = true;
    }
  }
  if (userSearch.ustensils.length > 0) {
    if (alreadyFilterWithTag) {
      resultatsWithTag = resultatsWithTag.filter((recipe) =>
        userSearch.ustensils.every((utensil) =>
          recipe.ustensilsLabelsList.includes(utensil)
        )
      );
    } else {
      resultatsWithTag = arr.filter((recipe) =>
        userSearch.ustensils.every((utensil) =>
          recipe.ustensilsLabelsList.includes(utensil)
        )
      );
      alreadyFilterWithTag = true;
    }
  }
  showResult(resultatsWithTag);
  updateDropdownList(resultatsWithTag);
}

/**
 * Récupère les recettes correspondant à la requête
 * @param {Recipe[]} arr - tableau de recettes
 * @param {string} query - Requête de l'utilisateur
 * @returns {Recipe[]} - Retourne un tableau de recettes liés à la requête
 */
function retrieveMatchingRecipes(arr, query) {
  let tempResult = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name.toLowerCase().includes(query)) {
      tempResult.push(arr[i]);
    } else if (arr[i].description.toLowerCase().includes(query)) {
      tempResult.push(arr[i]);
    } else if (
      arr[i].ingredients.some((item) =>
        item.ingredient.toLowerCase().includes(query)
      )
    ) {
      tempResult.push(arr[i]);
    }
  }
  return tempResult;
}

// Affiche toutes les recettes
function displayAllRecipes() {
  $recipeGrid.innerHTML = recipesDomElements.join("");
}

// Affiche toutes les recettes et met à jour les dropdowns
function displayAllRecipesAndDropdownList() {
  displayAllRecipes();
  updateDropdownList(recipes);
}

// Affiche le message d'erreur et vide les dropdowns
function showNoResultMessage() {
  const messageNoResultat = `<p>Aucune recette ne correspond à votre recherche</p>`;
  $dropdownListIngredients.innerHTML = "";
  $dropdownListAppliances.innerHTML = "";
  $dropdownListUtensils.innerHTML = "";
  $recipeGrid.innerHTML = messageNoResultat;
}

/**
 * Affiche les cartes des recettes dans le container
 * @param {Recipe[]} result - Tableau de recettes
 */
function showResult(result) {
  const totalRecipes = document.querySelector(".total__recipes");
  totalRecipes.innerHTML = result.length + " recettes ";
  $recipeGrid.innerHTML = "";
  const resultDomElement = result.map((recipe) => {
    const recipeCard = new RecipeCard(recipe);
    return recipeCard.createCard();
  });

  $recipeGrid.innerHTML = resultDomElement.join("");
}
