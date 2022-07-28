const express = require("express")
const axios = require('axios')
const morgan = require("morgan")
const cors = require("cors")

const app = express()

const api_key = "a881bae80f664370858fb9bbfc57a42d"
const address_api_key = "44afbd3f3cc04714b96d0aa4e95b65c9"

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())

// fetches best recipes given user food items from API
app.get('/listapirecipes/:sort/', async (request, response) => {
    let params = {
        number: 5,
        instructionsRequired: true,
        addRecipeInformation: true,
        fillIngredients: true,
        sort: request.params.sort,
        apiKey: api_key
    }
    params = {
        ...params,
        ...(request.query.ingredients && { includeIngredients: request.query.ingredients }),
        ...(request.query.diet && { diet: request.query.diet }),
        ...(request.query.allergies && { intolerances: request.query.allergies })
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

// get current user location
app.get('/address', async (request, response) => {
    const params = {
        api_key: address_api_key
    }
    let address_url = "https://ipgeolocation.abstractapi.com/v1/";
    let { data } = await axios(address_url, { params })
    response.json(data);
});

module.exports = app