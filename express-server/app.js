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
app.get('/apiuserrecipes/:ingredients/:diets/:allergies', async (request, response) => {
    let params = {
        includeIngredients: request.params.ingredients,
        number: 5,
        instructionsRequired: true,
        sort: "max-used-ingredients",
        apiKey: api_key,
    }
    if (request.params.diets != "none") {
        params["diet"] = request.params.diets
    }
    if (request.params.allergies != "none") {
        params["intolerances"] = request.params.allergies
    }
    let recipes_url = "https://api.spoonacular.com/recipes/complexSearch";
    let { data } = await axios(recipes_url, { params })
    response.json(data);
});

// TODO: add in recipe information to each recipe so you don't need to create a separate request
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
app.get('/apistdrecipes/:diets/:allergies', async (request, response) => {
    const params = {
        apiKey: api_key,
        number: 5,
        sort: "popularity",
        instructionsRequired: true,
    }
    if (request.params.diets != "none") {
        params["diet"] = request.params.diets
    }
    if (request.params.allergies != "none") {
        params["intolerances"] = request.params.allergies
    }
    let recipes_url = `https://api.spoonacular.com/recipes/complexSearch`;
    let { data } = await axios(recipes_url, { params })
    response.json(data);
});

module.exports = app