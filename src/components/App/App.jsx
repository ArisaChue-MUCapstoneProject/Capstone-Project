import Navbar from "../Navbar/Navbar"
import Home from "../Home/Home"
import Profile from "../Profile/Profile"
import Recipes from "../Recipes/Recipes"
import Pantry from "../Pantry/Pantry"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"

export default function App() {

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

  var sampleRecipes = [
    {
        "id": 716429,
        "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
        "calories": 584,
        "carbs": "84g",
        "fat": "20g",
        "image": "https://spoonacular.com/recipeImages/716429-312x231.jpg",
        "imageType": "jpg",
        "protein": "19g"
    },
    {
        "id": 715538,
        "title": "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        "calories": 521,
        "carbs": "69g",
        "fat": "10g",
        "image": "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        "imageType": "jpg",
        "protein": "35g"
    },
    {
      "id": 716429,
      "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
      "calories": 584,
      "carbs": "84g",
      "fat": "20g",
      "image": "https://spoonacular.com/recipeImages/716429-312x231.jpg",
      "imageType": "jpg",
      "protein": "19g"
  },
  {
      "id": 715538,
      "title": "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
      "calories": 521,
      "carbs": "69g",
      "fat": "10g",
      "image": "https://spoonacular.com/recipeImages/715538-312x231.jpg",
      "imageType": "jpg",
      "protein": "35g"
  },
  {
    "id": 716429,
    "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
    "calories": 584,
    "carbs": "84g",
    "fat": "20g",
    "image": "https://spoonacular.com/recipeImages/716429-312x231.jpg",
    "imageType": "jpg",
    "protein": "19g"
},
{
    "id": 715538,
    "title": "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
    "calories": 521,
    "carbs": "69g",
    "fat": "10g",
    "image": "https://spoonacular.com/recipeImages/715538-312x231.jpg",
    "imageType": "jpg",
    "protein": "35g"
},
]

const [products, setProducts] = useState(basicProducts)
const [productForm, setProductForm] = useState(basicProductForm)

const handleProductQuantity = (productName, operation) => {
  // find index of productName
  let itemIndex = products.findIndex(item => item.name === productName)

  let newProducts = []
  for (let i = 0; i < products.length; i++) {
    newProducts.push(products[i])
  }

  if (operation == "add") {
    newProducts[itemIndex].quantity += 1
  } 
  else if (operation === "minus") {
    newProducts[itemIndex].quantity -= 1
    if (newProducts[itemIndex].quantity == 0) {
      newProducts.splice(itemIndex, 1)
    }
  } else {
    newProducts.splice(itemIndex, 1)
  }
  
  setProducts(newProducts)
}

const handleOnSubmitProductForm = () => {
  let itemName = productForm.name.toLowerCase()
  // find index of productName
  let itemIndex = products.findIndex(item => item.name === itemName)

  let newProducts = []
  for (let i = 0; i < products.length; i++) {
    newProducts.push(products[i])
  }

  if (itemIndex === -1) {
    let newItem = {
      name: itemName,
      quantity: Number(productForm.quantity)
    }
    newProducts.push(newItem)
  } else {
    newProducts[itemIndex].quantity += Number(productForm.quantity)
  }

  setProducts(newProducts)
  setProductForm(basicProductForm)
}

const handleOnProductFormChange = (event) => {
  let key = event.target.name
  let val = event.target.value
  let newProductForm = {
    name: productForm.name,
    quantity: productForm.quantity
  }

  newProductForm[key] = val
  
  setProductForm(newProductForm)
}

  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/recipes" element={<Recipes recipes={sampleRecipes}/>}/>
            <Route path="/pantry" element={<Pantry productForm={productForm} handleOnProductFormChange={handleOnProductFormChange} handleOnSubmitProductForm={handleOnSubmitProductForm} handleProductQuantity={handleProductQuantity} products={products}/>}/>
            <Route path="/shoppingcart" element={<ShoppingCart />}/>
          </Routes>
        </main>
      </BrowserRouter>
      
      
    </div>
  );
}
