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
  const [recipes, setRecipes] = useState([])
  const [userProducts, setUserProducts] = useState([])
  const [error, setError] = useState("")

  // update user data once page loads
  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      setUserProducts(userInfo.data.products)
    }
  }, [props.isLoading])

  // get best recipe matches with user's food items
  useEffect(() => {
    async function fetchStdRecipes() {
      try {
        var { data } = await axios(listStdRecipeUrl)
        setRecipes(data)
      } catch (err) {
        setError(err.message)
      }
    }

    if (!props.isLoading && userProducts === undefined) {
      fetchStdRecipes()
    }
  }, [props.isLoading])

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

    if (!props.isLoading && userProducts != undefined && userProducts.length > 0) {
      fetchUserRecipes()
    } 
  }, [props.isLoading, userProducts])

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
