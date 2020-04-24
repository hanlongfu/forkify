import Search from "./models/Search";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import Recipe from "./models/Recipe";
import List from "./models/List";
// global state of the app
// - search object
// - current recipe object
// - shopping list object
// - liked recipes
const state = {};

/* Search Controller */
const controlSearch = async () => {
	//1) get a query from view
	const query = searchView.getInput();

	if (query) {
		//2) New search object and add to state
		state.search = new Search(query);

		//3) Prepare UI for results
		searchView.clearInput(); //clear input keyword
		searchView.clearResults(); //clear prev reseach results
		renderLoader(elements.searchRes);
		try {
			//4) Search for recipes and wait till it is done
			await state.search.getResults();

			//5) render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch (err) {
			console.log("Something wrong with the search...");
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	controlSearch();
});

//element.closest() returns the closest ancestor of the current
//element (or the current element itself)
elements.searchResPages.addEventListener("click", (e) => {
	const btn = e.target.closest(".btn-inline");
	if (btn) {
		//'dataset.goto' reads 'data-goto'
		const gotoPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, gotoPage);
	}
});

/*
  Recipe Controller
*/
const controlRecipe = async () => {
	//window.location is the entire url
	//Get ID from url - window.location.hash
	const id = window.location.hash.replace("#", "");
	console.log(id);

	if (id) {
		// loading icon to signify data is being loaded
		// clear previous results first
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// Highlight selected search item
		if (state.search) searchView.highlightSelected(id);

		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
		} catch (err) {
			console.log("Error processing recipe!");
		}
	}
};

["hashchange", "load"].forEach((e) =>
	window.addEventListener(e, controlRecipe)
);

/*
  List Controller
*/

const controlList = () => {
	//create a new list if there is none yet
	if (!state.list) state.list = new List();

	// add each ingredent to the list and the UI
	state.recipe.ingredients.forEach((el) => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

// handling recipe serving button clicks : increase/decrease servings
elements.recipe.addEventListener("click", (e) => {
	// * universal selector for child elements
	// .btn-decrease * : child elements of btn-decrease
	if (e.target.matches(".btn-decrease, .btn-decrease * ")) {
		//decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings("dec");
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches(".btn-increase, .btn-increase * ")) {
		state.recipe.updateServings("inc");
		recipeView.updateServingsIngredients(state.recipe);

		// add items to shopping cart
	} else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
		controlList();
	}
});

window.l = new List();
