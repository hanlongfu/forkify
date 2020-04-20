import { elements } from './base';

//implicit return for one-line arrow function
export const getInput = () => elements.searchInput.value;

//clear input
export const clearInput = () => elements.searchInput.value = '';

//clear previous results
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
};

//limit the recipe title to 17  words
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if(title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if(acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    //return the result
    return `${newTitle.join(' ')}...`;
  } 
    return title;
};
5
//render recipe on UI
const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="likes__link" href="#${recipe.recipe_id}">
          <figure class="likes__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="likes__data">
              <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="likes__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
  `;

  //insert markup under results__list
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};