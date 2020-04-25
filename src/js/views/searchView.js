import { elements } from "./base";

//implicit return for one-line arrow function
export const getInput = () => elements.searchInput.value;

//clear input
export const clearInput = () => (elements.searchInput.value = "");

//clear previous results
export const clearResults = () => {
	//clear the results
	elements.searchResList.innerHTML = "";
	//clear the buttons
	elements.searchResPages.innerHTML = "";
};

// selected recipe is slightly greyed out
export const highlightSelected = (id) => {
	// first remove highlighted selection from all items
	const resultsArr = Array.from(document.querySelectorAll(".results__link"));
	resultsArr.forEach((e) => {
		e.classList.remove("results__link--active");
	});

	// a[href] -> a type of css selector
	document
		.querySelector(`.results__link[href*="${id}"]`)
		.classList.add("results__link--active");
};

//limit the recipe title to 17  words
export const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(" ").reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);

		//return the result
		return `${newTitle.join(" ")}...`;
	}
	return title;
};

//render recipe on UI
const renderRecipe = (recipe) => {
	const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
  `;

	//insert markup under results__list
	elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// create button for results
// type: 'prev' or 'next'
// data-goto: HTML5 feature that can be read by dataset.goto
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto = ${
	type === "prev" ? page - 1 : page + 1
} >
        <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${
						type === "prev" ? "left" : "right"
					}"></use>
        </svg>
        <span>Page ${type === "prev" ? page - 1 : page + 1} </span>
     </button>
`;

//render forward and backward buttons on results column
const renderButton = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	let button;

	//on 1st page
	if (page === 1 && pages > 1) {
		//button to go to next page
		button = createButton(page, "next");

		// between page 2 to penultimate page
	} else if (page < pages) {
		//Buttons to go backward and forward
		button = `
      ${createButton(page, "prev")}
      ${createButton(page, "next")}
    `;

		// on last page
	} else if (page === pages && pages > 1) {
		// only button to go to prev page
		button = createButton(page, "prev");
	}

	elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	//render results of current page
	// page 1 = 0; page 2 = resPerPage = 10, page 3 = 2 * resPerPage = 20
	// starts every resPerPage or 10th, with the first page starts 0
	// ends every resPerpage or 10th
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	recipes.slice(start, end).forEach(renderRecipe);

	//render pagination buttons
	renderButton(page, recipes.length, resPerPage);
};
