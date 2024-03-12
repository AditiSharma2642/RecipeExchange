require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * this is gonna be get page that  will be our  "/"  
 * Homepage
 */
exports.homepage = async(req,res) => {


    try {
        
        const limitNumber = 5; //i want 5 categories
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        
        
        const thai =await Recipe.find({'category': 'Thai'}).limit(limitNumber);
        const american =await Recipe.find({'category': 'American'}).limit(limitNumber);
        const chinese =await Recipe.find({'category': 'Chinese'}).limit(limitNumber);
    
        const food = {latest, thai, american, chinese };


        res.render('index',{ title: 'Homepage', categories, food}); //we passed the title and page(index) and categories obj which we created above
        //const categories: This declares a constant variable named categories that will store the result of the database query.
// await Category.find({}): The Category is a Mongoose model representing a MongoDB collection. The find({}) method is used to find all documents in the Category collection. The empty {} parameter indicates that there are no specific conditions for the search, so it will return all documents in the collection.
// .limit(limitNumber): The limit() method is a MongoDB query modifier that limits the number of documents returned by the query. The limitNumber variable specifies the maximum number of documents to be returned. It determines the limit on the number of categories retrieved from the database.
// await: The await keyword is used to wait for the Category.find().limit() operation to complete before proceeding. It can only be used within an async function.


    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

/** 
 * GET /categories
 * Categories
 */

exports.exploreCategories = async(req,res) => {


    try {
        
        const limitNumber = 20; 
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories',{ title: 'Categories', categories});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/** 
 * GET /categories/id
 * Categories by id
 */
exports.exploreCategoriesByID = async(req,res) => {


    try {
        
        let categoryId = req.params.id;
        const limitNumber = 20; 
        const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);
        res.render('categories',{ title: 'Categories', categoryById});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

/** 
 * GET /recipe/:id
 * recipe
 */

exports.exploreRecipe = async(req,res) => {


    try {
        let recipeId = req.params.id;
        
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe',{ title: 'Recipe',recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

/** 
 * POST /search
 * search
 */

exports.searchRecipe = async(req,res) => {

    //
    try {
            let searchTerm = req.body.searchTerm; 
            let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true }} );
            res.render('search',{ title: 'The Recipe Exchange-Search', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
    
}

/** 
 * GET /explore-latest
 * Explore Latest
 */

exports.exploreLatest = async(req,res) => {


    try {
            const limitNumber = 20; 
            const recipe = await Recipe.find({}).sort({ _id: -1}).limit(limitNumber);
        res.render('explore-latest',{ title: 'Explore Latest',recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

/** 
 * GET /explore-random
 * Explore Random
 */

exports.exploreRandom = async(req,res) => {
    try {
            let count = await Recipe.find().countDocuments();
            let random = Math.floor(Math.random() * count);
            let recipe = await Recipe.findOne().skip(random).exec();
            
        res.render('explore-random',{ title: 'Explore Latest',recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

/** 
 * GET /submit-recipe
 * Submit Recipe
 */

exports.submitRecipe = async(req,res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    res.render('submit-recipe',{ title: 'Submit Recipe', infoErrorsObj, infoSubmitObj});

}
/** 
 * Post /submit-recipe
 * Submit Recipe
 */

exports.submitRecipeOnPost = async(req,res) => {

    try {


        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No files were uploaded')
        }else{

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./')+ '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            })
        }
        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredient,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save()
        req.flash('infoSubmit', 'Recipe has been added. ');
        res.redirect('/submit-recipe');
    } catch (error) {
        // res.json(error);
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
    }   
}

async function updateRecipe(){
    try {
        const res = await Recipe.updateOne
        ({name: 'Recipe from form'}, {name: 'new Recipe updated'});
        res.n; //this will be no.of documnets matched
        res.nModified; //number of documnets modified
    } catch (error) {
        console.log(error);
    }
}
updateRecipe();

async function deleteRecipe(){
    try {
        await Recipe.deleteOne
        ( {name: 'New Recipe with image'});
    } catch (error) {
        console.log(error);
    }
}
deleteRecipe();


// async function insertDummyCategoryData(){
//     try {
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             }
//         ]); //if this fail the catch block wil catch the error
//     } catch (error) {
//         console.log('err', + error);
//     }
// }



// async function insertDummyRecipeData(){
//     try {
//         await Recipe.insertMany([
//                 {
//                     "name": "Tom Daley's sweet & sour chicken",
//                     "description": 'For Tom Daleys sweet & sour chicken recipe, marinate chicken in a soy sauce and ginger mixture. Stir-fry the chicken until cooked, then set aside. In the same pan, stir-fry bell peppers, onions, and pineapple. Return the chicken to the pan, add a sweet and tangy sauce made from ketchup, pineapple juice, and brown sugar. Cook until the sauce thickens and coats the chicken and vegetables. Serve over rice and garnish with green onions if desired. Enjoy!',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "1 lime",
//                         "2 cloves of garlic",
//                         "1 bunch of asparagus" ,
//                         "100 g tenderstem broccoli",
//                         "1 small onion",
//                         "2 fresh red chillies",
//                         "1 red pepper",
//                         "1 yellow pepper",
//                         "7 cm piece of ginger"
//                     ],
//                     "category": "American",
//                     "image": "Tom-Daley's-sweet-sour-chicken.jpg "
//                 },
//                 {
//                     "name": "chicken vindaloo",
//                     "description": 'To prepare chicken vindaloo, marinate chicken pieces in a mixture of vinegar, ginger, garlic, and spices. Sauté onions until golden brown, then add the marinated chicken and brown it. Stir in tomato paste, diced tomatoes, water, red chili powder, and garam masala. Cover and simmer until the chicken is tender. Adjust the seasoning and garnish with cilantro. Serve with rice or naan bread for a flavorful chicken vindaloo dish.',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "1 lime",
//                         "2 cloves of garlic",
//                         "1 bunch of asparagus" ,
//                         "100 g tenderstem broccoli",
//                         "1 small onion",
//                         "2 fresh red chillies",
//                         "1 red pepper",
//                         "1 yellow pepper",
//                         "7 cm piece of ginger"
//                     ],
//                     "category": "American",
//                     "image": "Tom-Daley's-sweet-sour-chicken.jpg "
//                 },
//                 {
//                     "name": "Tom Daley's sweet & sour chicken",
//                     "description": 'For Tom Daleys sweet & sour chicken recipe, marinate chicken in a soy sauce and ginger mixture. Stir-fry the chicken until cooked, then set aside. In the same pan, stir-fry bell peppers, onions, and pineapple. Return the chicken to the pan, add a sweet and tangy sauce made from ketchup, pineapple juice, and brown sugar. Cook until the sauce thickens and coats the chicken and vegetables. Serve over rice and garnish with green onions if desired. Enjoy!',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "1 Chicken",
//                         "Vinegar",
//                         "Garlic" ,
//                         "Tomato paste",
//                         "1 small onion",
//                         "2 fresh red chillies",
//                         "1 red pepper",
//                         "1 yellow pepper",
//                         "7 cm piece of ginger"
//                     ],
//                     "category": "Indian",
//                     "image": "vindaloo-chicken.jpg "
//                 },
//                 {
//                     "name": "Quesadillas",
//                     "description": 'start by heating a skillet or griddle over medium heat. Place a tortilla on the skillet and sprinkle shredded cheese on one half of the tortilla. You can use any type of cheese you prefer, such as cheddar, Monterey Jack, or a blend. Add any desired fillings, such as cooked chicken, sautéed vegetables, or sliced avocado. Fold the tortilla in half to cover the filling. Cook for a few minutes until the cheese starts to melt and the tortilla turns golden brown. Carefully flip the quesadilla and cook for a few more minutes until the other side is crispy and the cheese is fully melted. Remove from the heat and let it cool for a minute before cutting it into wedges',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "1 lime",
//                         "2 cloves of garlic",
//                         "Sliced avacado" ,
//                         "Refried beans",
//                         "1 small onion",
//                         "2 fresh red chillies",
//                         "1 red pepper",
//                         "Cilantro",
//                         "Cheese"
//                     ],
//                     "category": "Mexican",
//                     "image": "Quesadillas.jpg "
//                 },
//                 {
//                     "name": "stir-fried noodles",
//                     "description": 'start by boiling noodles of your choice according to the package instructions. Drain and set aside. In a hot wok or large skillet, heat oil and add minced garlic and sliced vegetables like bell peppers, carrots, and cabbage. Stir-fry for a few minutes until the vegetables are tender-crisp. Push the vegetables to one side of the pan and crack an egg into the empty space. Scramble the egg and mix it with the vegetables. Add the cooked noodles to the pan and pour in a sauce made from soy sauce, oyster sauce, and a touch of sesame oil. Toss everything together until well-coated and heated through. Adjust the seasoning if needed and garnish with chopped green onions and a sprinkle of sesame seeds',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "Noodles",
//                         "2 cloves of garlic",
//                         "1 bunch of asparagus" ,
//                         "sESAME OIL",
//                         "Oyster sauce",
//                         "2 fresh red chillies",
//                         "1 red pepper",
//                         "1 yellow pepper",
//                         "7 cm piece of ginger"
//                     ],
//                     "category": "Chinese",
//                     "image": "stir-fried-noodles.jpg "
//                 },
//                 {
//                     "name": "Pad Thai",
//                     "description": ' start by soaking rice noodles in hot water until they soften. In a hot pan or wok, heat oil and sauté minced garlic and tofu (optional) until lightly browned. Push the tofu to one side and crack an egg into the empty space, scrambling it. Add the soaked noodles and stir-fry everything together. Add shrimp, chicken, or your preferred protein, along with bean sprouts, sliced green onions, and crushed peanuts. In a separate bowl, mix tamarind paste, fish sauce, sugar, and water to create a sauce, then pour it over the noodles. Continue stirring until the sauce coats the noodles and the ingredients are well combined.!',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "Rice noodles",
//                         "Garlic (minced)",
//                         "Shrimp, chicken, or preferred proteins" ,
//                         "Crushed peanuts",
//                         "Bean sprouts",
//                         "2 fresh red chillies",
//                         "Fish sauce",
//                         "1 yellow pepper",
//                         "Sugar "
//                     ],
//                     "category": "Thai",
//                     "image": "Pad-Thai.jpg "
//                 },
//                 {
//                     "name": "Ham Burger",
//                     "description": 'Shape the ground beef into patties, season with salt and pepper, and cook them on a grill or stovetop. Toast the buns, then assemble the burger with lettuce, tomato, onion, pickles, cheese, and condiments. Enjoy your delicious homemade hamburger!!',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "pickle",
//                         "lettuce",
//                         "mustard" ,
//                         "Ketchup",
//                         "onion",
//                         "2 fresh red chillies",
//                         "1 red pepper",
//                         "1 yellow pepper",
//                         "cheese"
//                     ],
//                     "category": "Thai",
//                     "image": "Ham-Burger.jpg "
//                 },
//                 {
//                     "name": "Dragon Candy",
//                     "description": 'To make dragon candy, start by mixing cornstarch and water in a saucepan until well combined. Cook the mixture over medium heat, stirring continuously, until it thickens and forms a sticky dough-like consistency. Remove from heat and let it cool for a few minutes. Dust a clean surface with cornstarch and transfer the dough onto it. Knead the dough with your hands until it becomes smooth and pliable. Using a pair of kitchen scissors, cut the dough into small portions and roll them into thin strands resembling dragons beards. Dust the strands with cornstarch to prevent sticking. Finally, twist the strands into small bundles or shape them into bite-sized pieces. Enjoy !',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "cornstarch",
//                         "water",
                        
//                     ],
//                     "category": "Chinese",
//                     "image": "Dragon-candy.jpg "
//                 },
//                 {
//                     "name": "TMalai Kofta",
//                     "description": 'The koftas (dumplings) are made by combining mashed paneer, boiled potatoes, nuts, and aromatic spices. They are then shaped into balls and deep-fried until golden brown. The curry is prepared by simmering a blend of tomatoes, cashews, cream, and spices, creating a luxurious and smooth texture. The koftas are gently placed in the curry just before serving, allowing them to absorb the flavors. Malai Kofta is often garnished with a drizzle of fresh cream and a sprinkle of chopped nuts.. Enjoy!',
//                     "email": "abcd@gmail.com",
//                     "ingredients": [
//                         "Tomatoes",
//                         "Onion (finely chopped)",
//                         "Cashews",
//                         "Fresh cream or heavy cream","Butter or ghee (clarified butter)",
//                         "Ginger-garlic paste",
//                         "Green chili (finely chopped)",
//                         "Turmeric powder",
//                         "Red chili powder",
//                         "Coriander powder",
//                         "Cumin powder", 
//                         "Garam masala",
//                         "Sugar (optional, for balancing flavors)",
//                         "Salt",
//                         "Water or vegetable broth"
//                     ],
//                     "category": "Indian",
//                     "image": "Malai-Kofta.jpg "
//                 },
                
//             ]
            
//         ); //if this fail the catch block wil catch the error
//     } catch (error) {
//         console.log('err', + error);
//     }
// }

// insertDummyRecipeData();