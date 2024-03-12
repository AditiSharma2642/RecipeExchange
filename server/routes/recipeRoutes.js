const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes(this is where we will list all of our pages and they are gonna bbe linkes to recipeController)
 */
router.get('/',recipeController.homepage); //route to get homepage
router.get('/categories',recipeController.exploreCategories);
router.get('/recipe/:id',recipeController.exploreRecipe);
router.get('/categories/:id',recipeController.exploreCategoriesByID);
router.post('/search',recipeController.searchRecipe);
router.get('/explore-latest',recipeController.exploreLatest);
router.get('/explore-random',recipeController.exploreRandom);
router.get('/submit-recipe',recipeController.submitRecipe);
router.post('/submit-recipe',recipeController.submitRecipeOnPost);
router.get('/about');
router.get('/contact');


module.exports = router;