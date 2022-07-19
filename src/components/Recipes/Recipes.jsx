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
  const [userDiets, setUserDiets] = useState([])
  const [userAllergies, setUserAllergies] = useState([])
  const [error, setError] = useState("")
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true)
  const [isRecipesLoading, setIsRecipesLoading] = useState(true)

  function clearError() {
    setError("")
  }

  // update user data once page loads
  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.products && setUserProducts(userInfo.data.products)
      userInfo.data.diets && setUserDiets(userInfo.data.diets)
      userInfo.data.allergies && setUserAllergies(userInfo.data.allergies)
      setIsUserInfoLoading(false)
    }
  }, [props.isLoading])

  // get best recipe matches with user's food items
  useEffect(() => {
    async function fetchStdRecipes() {
      clearError()
      try {
        let customParams = ""
        userDiets.length == 0 ? customParams += "/none" : customParams += "/" + userDiets.join(",")
        userAllergies.length == 0 ? customParams += "/none" : customParams += "/" + userAllergies.join(",")

        var { data } = await axios(listStdRecipeUrl + customParams)
        setRecipes(data.results)
        setIsRecipesLoading(false)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }

    if (!isUserInfoLoading && !props.isLoading && userProducts.length == 0) {
      fetchStdRecipes()
    }
  }, [isUserInfoLoading, props.isLoading])

  // get best recipe matches with user's food items
  useEffect(() => {
    async function fetchUserRecipes() {
      try {
        clearError()
        // API parameter format: ingredient,+ingredient,+ingredient
        let customParams = userProducts.map((product) => (product.name)).join(",")
        userDiets.length == 0 ? customParams += "/none" : customParams += "/" + userDiets.join(",")
        userAllergies.length == 0 ? customParams += "/none" : customParams += "/" + userAllergies.join(",")

        const recipeApiIngredients = listUserRecipeUrl + customParams
        var { data } = await axios(recipeApiIngredients)
        setRecipes(data.results)
        setIsRecipesLoading(false)
      } catch (err) {
        setError(err.message)
      }
    }

    if (!isUserInfoLoading && !props.isLoading && userProducts.length > 0) {
      fetchUserRecipes()
    } 
  }, [isUserInfoLoading, props.isLoading, userProducts])

  return (
    <nav className="recipes">
      <h2 className="recipes-heading">Recipes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {recipes && recipes.length > 0 
        ? <div className="recipes-grid">
          {
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} image={recipe.image} recipeModelShow={props.recipeModelShow} handleRecipeModal={props.handleRecipeModal} handleRecipeCardClick={props.handleRecipeCardClick} recipeInfo={props.recipeInfo}/>
            ))
          }
        </div>
        : isRecipesLoading 
          ? <p>Loading</p>
          : <p>Please decrease your restrictions</p>
      }
    </nav>
  )
}
