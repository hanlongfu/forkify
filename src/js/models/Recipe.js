import axios from 'axios';

export default class Recipe{
  constructor(id){
    this.id = id;
  }
  async getRecipe(){
    try{
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    }catch(error){
      console.log(error);
    }
  }

  calcTime(){
      // Assume we need 15 min for each 3 ingredients
      const numIngredients = this.ingredients.length;
      const periods = Math.ceil(numIngredients / 3);
      this.time = periods * 15;

  }

  calcServings(){
    this.servings = 4;
  }

  // reformat ingredients
  parseIngredients(){
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz','tsp', 'tsp', 'cup', 'pound'];     

    const newIngredients = this.ingredients.map(e => {
      // 1) uniform units
      let ingredient = e.toLowerCase();
      unitsLong.forEach((unit, idx) => {
        ingredient = ingredient.replace(unit, unitsShort[idx]);
      });

      // 2) Remove parens
      ingredient = ingredient.replace(/ *\([^]*\) */g, " ");

      // 3) format ingredients into count, unit and ingredient
      return ingredient;

    });
    this.ingredients = newIngredients;
  }

}