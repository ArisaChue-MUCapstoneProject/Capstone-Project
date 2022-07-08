const express = require("express")
// const fetch = require('node-fetch')
const axios = require('axios')
const morgan = require("morgan")
const cors = require("cors")

const app = express()

const api_key = "a881bae80f664370858fb9bbfc57a42d"

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())

// fetches best recipes given user food items from API
app.get('/apirecipes/:ingredients', async (request, response) => {
    let recipes_url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${request.params.ingredients}&number=20&instructionsRequired=true&fillIngredients=true&apiKey=${api_key}`;
    let { data } = await axios(recipes_url)
    response.json(data);
});

// fetches recipe specific info given recipe id from API
app.get('/apirecipeinfo/:recipeid', async (request, response) => {
    let recipes_url = `https://api.spoonacular.com/recipes/${request.params.recipeid}/information?apiKey=${api_key}`;
    let { data } = await axios(recipes_url)
    response.json(data);
});

module.exports = app