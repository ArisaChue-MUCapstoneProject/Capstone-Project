const express = require("express")
const axios = require('axios')
const morgan = require("morgan")
const cors = require("cors")
const { parseActionCodeURL } = require("firebase/auth")

const app = express()

const api_key = "a881bae80f664370858fb9bbfc57a42d"

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())

// fetches best recipes given user food items from API
app.get('/apiuserrecipes/:ingredients', async (request, response) => {
    const params = {
        ingredients: request.params.ingredients,
        number: 20,
        instructionsRequired: true,
        fillIngredients: true,
        apiKey: api_key
    }
    let recipes_url = "https://api.spoonacular.com/recipes/findByIngredients";
    let { data } = await axios(recipes_url, { params })
    response.json(data);
});

// fetches recipe specific info given recipe id from API
app.get('/apirecipeinfo/:recipeid', async (request, response) => {
    const params = {
        apiKey: api_key
    }
    let recipes_url = `https://api.spoonacular.com/recipes/${request.params.recipeid}/information`;
    let { data } = await axios(recipes_url, { params })
    response.json(data);
});

// fetches standard popular recipes
app.get('/apistdrecipes', async (request, response) => {
    const params = {
        apiKey: api_key,
        number: 20,
        sort: "random",
        addRecipeInformation: true,
        instructionsRequired: true,
        fillIngredients: true
    }
    let recipes_url = `https://api.spoonacular.com/recipes/complexSearch`;
    let { data } = await axios(recipes_url, { params })
    response.json(data.results);
});

module.exports = app