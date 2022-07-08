import Navbar from "../Navbar/Navbar"
import Home from "../Home/Home"
import Profile from "../Profile/Profile"
import Recipes from "../Recipes/Recipes"
import Pantry from "../Pantry/Pantry"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import { constRecipes, constRecipeInstructions, constRecipeInfo } from "../constants/constants"
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from 'axios';

export default function App() {

  //TODO: move component specific code into components

  //TODO: replace with empty array once testing is done
  var basicProducts = [
    {name: "apple",
    quantity: 2},
    {name: "orange",
    quantity: 5},
    {name: "grape",
    quantity: 8},
    {name: "bacon",
    quantity: 3},
    {name: "milk",
    quantity: 2},
    {name: "pasta",
    quantity: 1}
  ]

  var basicProductForm = {
    name: "",
    quantity: ""
  }

  //TODO: replace these placeholders once we integrate with the recipe API
  const sampleRecipeInstructions = constRecipeInstructions

  const sampleRecipeInfo = constRecipeInfo

  const recipeApiUrl = "http://localhost:3001/apirecipes/"

// state variables
const [products, setProducts] = useState(basicProducts)
const [productForm, setProductForm] = useState(basicProductForm)
const [recipeModelShow, setRecipeModalShow] = useState(false)
const [recipeInstructions, setRecipeInstructions] = useState([])
const [recipeInfo, setRecipeInfo] = useState({})
const [recipes, setRecipes] = useState([])

//enum 
const Operations = Object.freeze({
  Add: Symbol("add"),
  Subtract: Symbol("subtract"),
  Erase: Symbol("erase")
})

// get best recipe matches with user's food items
useEffect(() => {
  async function fetchData() {
    try {
      // API parameter format: ingredient,+ingredient,+ingredient
      let ingredientParams = products.map((product) => (product.name)).join(",+")
      const recipeApiIngredients = recipeApiUrl + ingredientParams
      var { data } = await axios(recipeApiIngredients)
      setRecipes(data)
    } catch (err) {
      console.log("error in fetching from backend")
    }
  }
  fetchData()
}, [products])

// changes product item quantity based on button click
const handleProductQuantity = (productName, operation) => {
  let itemIndex = products.findIndex(item => item.name === productName)

  let newProducts = [...products]

  // edit item quantity
  //TODO: throw error if item didn't exist in products
  if (operation === Operations.Add) {
    newProducts[itemIndex].quantity += 1
  } 
  else if (operation === Operations.Subtract) {
    newProducts[itemIndex].quantity -= 1
    if (newProducts[itemIndex].quantity == 0) {
      newProducts.splice(itemIndex, 1)
    }
  } else if (operation === Operations.Erase) {
    newProducts.splice(itemIndex, 1)
  } else {
    //TODO: use proper error handling
    console.log("no operations match")
  }
  
  // update products state
  setProducts(newProducts)
  console.log("new products update: ", products)
}

// adds new product item when submit button is clicked
const handleOnSubmitProductForm = () => {
  // submitted info from form
  let itemName = productForm.name.toLowerCase()
  let itemIndex = products.findIndex(item => item.name === itemName)

  let newProducts = [...products]

  // add new item to products
  //TODO: check if productForm.quantity is positive whole number
  if (itemIndex === -1) {
    let newItem = {
      name: itemName,
      quantity: Number(productForm.quantity)
    }
    newProducts.push(newItem)
  } else {
    // if user submitted an item that already exists, just change quantity
    newProducts[itemIndex].quantity += Number(productForm.quantity)
  }

  setProducts(newProducts)
  setProductForm(basicProductForm)
}

// when the inputs of products form changes
const handleOnProductFormChange = (event) => {
  let key = event.target.name
  let val = event.target.value
  // deep copy of product form
  let newProductForm = {
    name: productForm.name,
    quantity: productForm.quantity
  }
  // update with the change (either item name or quantity)
  newProductForm[key] = val
  setProductForm(newProductForm)
}

// onclick function for each recipe card
const handleRecipeCardClick = (showStatus, recipeId) => {
  handleRecipeModal(showStatus)
  handleGetRecipeInstructions(recipeId)
}

// pop up recipe modal for specific recipe card
const handleRecipeModal = (showStatus) => {
  setRecipeModalShow(showStatus)
}

// extract recipe instructions for recipe modal
const handleGetRecipeInstructions = (recipeId) => {
  //TODO: extract recipe instructions for specific given recipe using API
  setRecipeInstructions(sampleRecipeInstructions)
  setRecipeInfo(sampleRecipeInfo)
}

  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/recipes" element={<Recipes recipeInfo={recipeInfo} handleRecipeCardClick={handleRecipeCardClick} recipeInstructions={recipeInstructions} handleRecipeModal={handleRecipeModal} recipeModelShow={recipeModelShow} recipes={recipes}/>}/>
            <Route path="/pantry" element={<Pantry operations={Operations} productForm={productForm} handleOnProductFormChange={handleOnProductFormChange} handleOnSubmitProductForm={handleOnSubmitProductForm} handleProductQuantity={handleProductQuantity} products={products}/>}/>
            <Route path="/shoppingcart" element={<ShoppingCart />}/>
          </Routes>
        </main>
      </BrowserRouter>
      
      
    </div>
  );
}
