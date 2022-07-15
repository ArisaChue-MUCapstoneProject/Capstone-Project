import * as React from "react"
import { useState, useEffect } from "react"
import { Alert } from "react-bootstrap" 
import axios from 'axios';
import "./Recipes.css"

import { useAuth } from "../../contexts/AuthContext"
import RecipeCard from "../RecipeCard/RecipeCard"

export default function Recipes(props) {
  // get user data from the database
  const { currentUser } = useAuth()
  
  const listUserRecipeUrl = "http://localhost:3001/apiuserrecipes/"
  const listStdRecipeUrl = "http://localhost:3001/apistdrecipes"
  const [userInfo, setUserInfo] = useState({})
  const [recipes, setRecipes] = useState([])
  const [error, setError] = useState("")
  
  var userProducts = []
  if (userInfo == undefined) {
    setError("Please log in first")
  }
  // TODO: look into why userInfo keeps becoming undefined when refresh (current user is not undefined)
  else if (userInfo !== undefined && userInfo.data != undefined && userInfo.data.products !== undefined) {
    var userProducts = userInfo.data.products
  }

  // get best recipe matches with user's food items
  useEffect(() => {
    setUserInfo(props.users.find(u => u.uid === currentUser.uid))
    async function fetchStdRecipes() {
      try {
        var { data } = await axios(listStdRecipeUrl)
        setRecipes(data)
      } catch (err) {
        setError(err.message)
      }
    }

    if (userProducts.length === 0) {
      fetchStdRecipes()
    }
  }, [])

  // get best recipe matches with user's food items
  useEffect(() => {
    async function fetchUserRecipes() {
      try {
        // API parameter format: ingredient,+ingredient,+ingredient
        let ingredientParams = userProducts.map((product) => (product.name)).join(",+")
        const recipeApiIngredients = listUserRecipeUrl + ingredientParams
        var { data } = await axios(recipeApiIngredients)
        setRecipes(data)
      } catch (err) {
        setError(err.message)
      }
    }

    if (userProducts.length > 0) {
      fetchUserRecipes()
    } 
  }, [userProducts])

  return (
    <nav className="recipes">
      <h2 className="recipes-heading">Recipes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="recipes-grid">
        {
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} image={recipe.image} recipeModelShow={props.recipeModelShow} handleRecipeModal={props.handleRecipeModal} handleRecipeCardClick={props.handleRecipeCardClick} recipeInfo={props.recipeInfo}/>
          ))
        }
      </div>
    </nav>
  )
}
