const express = require("express")
const axios = require('axios')
const morgan = require("morgan")
const cors = require("cors")
const dotenv = require('dotenv');

const app = express()

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())
dotenv.config();

// Microsoft Azure Receipt Form Recognizer SDK
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const key = process.env.REACT_APP_RECEIPTS_API_KEY;
const endpoint = "https://mu-capstone.cognitiveservices.azure.com/";

// fetches best recipes given user food items from API
app.get('/listapirecipes/:sort/', async (request, response) => {
    let params = {
        number: 12,
        instructionsRequired: true,
        addRecipeInformation: true,
        fillIngredients: true,
        sort: request.params.sort,
        apiKey: process.env.REACT_APP_RECIPES_API_KEY
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
        apiKey: process.env.REACT_APP_RECIPES_API_KEY
    }
    let recipes_url = `https://api.spoonacular.com/recipes/${request.params.recipeid}/information`;
    let { data } = await axios(recipes_url, { params })
    response.json(data);
});

// get current user location (reverse geocoding)
app.get('/address/:lat/:long', async (request, response) => {
    const params = {
        lat: request.params.lat,
        lon: request.params.long,
        apiKey: process.env.REACT_APP_MAP_API_KEY
    }
    let address_url = "https://api.geoapify.com/v1/geocode/reverse";
    let { data } = await axios(address_url, { params })
    response.json(data);
});

// reading image url of receipt into string
async function readReceipt(receiptUrl) {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
    const poller = await client.beginAnalyzeDocument("prebuilt-receipt", receiptUrl);

    const {
        documents: [result]
    } = await poller.pollUntilDone();

    if (!result) {
        throw new Error("Expected at least one receipt in the result.");
    }
    return result
}

app.post('/receipt', async (request, response) => {
    const { fields } = await readReceipt(request.body.url)
    response.json(fields);
});

module.exports = app