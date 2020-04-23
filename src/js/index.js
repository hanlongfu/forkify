import Search from './models/Search';
import { elements, renderLoader,  clearLoader } from './views/base';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';
// global state of the app
// - search object
// - current recipe object
// - shopping list object
// - liked recipes
const state = {};

/* Search Controller */
const controlSearch = async () => {
  //1) get a query from view
  // const query = searchView.getInput();
  const query = 'pizza';

  if (query) {
    //2) New search object and add to state
    state.search = new Search(query);

    //3) Prepare UI for results
    searchView.clearInput();      //clear input keyword
    searchView.clearResults();    //clear prev reseach results
    renderLoader(elements.searchRes);
    try{
      //4) Search for recipes and wait till it is done
      await state.search.getResults();

      //5) render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
      
    } catch(err){
      alert('Something wrong with the search...');
      clearLoader();
    }
    
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

//for testing
window.addEventListener('load', e => {
  e.preventDefault();
  controlSearch();
});

//element.closest() returns the closest ancestor of the current
//element (or the current element itself)
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if(btn) {
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
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if(id){
    // prepare UI for changes

    // Create new recipe object
    state.recipe = new Recipe(id);
   
    // testing
    window.r = state.recipe;

    try{
      // Get recipe data
      await state.recipe.getRecipe();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      console.log(state.recipe);

    } catch(err){
      alert('Error processing recipe!');
    }
    

  }

};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));