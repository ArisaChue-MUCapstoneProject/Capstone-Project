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

app.get('/apirecipes/:ingredients', async (request, response) => {
    console.log(request.params)
    const recipes_url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${request.params.ingredients}&number=20&apiKey=${api_key}`;
    let { data } = await axios(recipes_url)
    console.log(data)
    response.json(data);
  });

module.exports = app