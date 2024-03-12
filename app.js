//creating an express server
const express = require('express'); 
const expressLayouts = require('express-ejs-layouts'); //for express layout(helps in creating different layout for different scenario)
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const aboutContent = "Welcome to The Recipe Exchange - your source of culinary inspiration! We are passionate about cooking and sharing delicious recipes with you. Our blog features a diverse collection of mouthwatering dishes from various cuisines, carefully curated and tested by our team of experienced chefs. Whether you're a beginner or a seasoned home cook, we have recipes for every skill level. Join our food community, explore our recipe collection, and get ready to embark on a flavorful journey with us.!!";

const contactContent = "Contact Us: We welcome your inquiries and feedback! For any questions, suggestions, or collaboration opportunities, please feel free to reach out to us. You can contact us via email at aditisharma2642@gmail.com or connect with us on linkedin using the handle Aditi Sharma. We appreciate your interest and look forward to hearing from you. Thank you for being a part of our The recipe Exchange community!";


//initialising new express application
const app = express();
//setting port number
const port = process.env.PORT || 3000; 

//creating env file for storing all database detail
require('dotenv').config(); 

app.use(express.urlencoded({extended: true}));// to handle URL-encoded form data in HTTP POST requests.
app.use(express.static('public')); //to escape from hassle of mentionning full path everytime
app.use(expressLayouts);

app.use(cookieParser('TheRecipeExchangeSecure'));
app.use(session({
    secret: 'TheRecipeExchangeSecretSession',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout','./layouts/main');
app.set('view engine','ejs'); //to specify or set the default engine
const routes = require('./server/routes/recipeRoutes.js');
app.use('/',routes);



app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
});

app.listen(port,()=>console.log(`Listening to port ${port}`));