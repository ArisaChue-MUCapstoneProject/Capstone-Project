import * as React from "react"
import { useState } from "react"
import { Alert } from "react-bootstrap" 
import axios from 'axios';
import "./RecipeCard.css"

import RecipeModal from "../RecipeModal/RecipeModal"

export default function RecipeCard(props) {
  const recipeInfoUrl = "http://localhost:3001/apirecipeinfo/"
  const [recipeModelShow, setRecipeModalShow] = useState(false)
  const [error, setError] = useState("")
  const [modalError, setModalError] = useState("")

  // onclick function for each recipe card
  const handleRecipeCardClick = async (showStatus, recipeId) => {
    props.setIsIngredLoading(true)
    await handleGetRecipeInstructions(recipeId)
    handleRecipeModal(showStatus)
  }

  // pop up recipe modal for specific recipe card
  const handleRecipeModal = (showStatus) => {
    setRecipeModalShow(showStatus)
  }

  // extract recipe info from backend for recipe modal
  const handleGetRecipeInstructions = async (recipeId) => {
    const curRecipeInfo = props.recipes.find(recipe => recipe.id === recipeId)
    if (curRecipeInfo == null) {
      setModalError("recipe does not exist, please click on another one")
    } else if (curRecipeInfo.analyzedInstructions.length == 0) {
      // try fetching data from recipe specific get request
      try {
        var { data } = await axios(recipeInfoUrl + recipeId)
        props.setRecipeInfo(data)
      } catch (error) {
        setModalError(error.message)
      }
    } else {
      props.setRecipeInfo(curRecipeInfo)
    }
  }

  return (
    <div className="recipe-card">
        {/* recipe card */}
        {error && <Alert variant="danger">{error}</Alert>}
        <img src={props.image} alt={`recipe for ${props.title}`} onClick={() => handleRecipeCardClick(true, props.id)}/>
        <p className="recipe-name">{props.title}</p>
        {/* recipe modal */}
        <RecipeModal show={recipeModelShow} onHide={() => handleRecipeModal(false)} recipeInfo={props.recipeInfo} modalError={modalError} userDiets={props.userDiets} ingredientInfo={props.ingredientInfo} isIngredLoading={props.isIngredLoading} useRecipe={props.useRecipe} addIngredientToCart={props.addIngredientToCart}></RecipeModal>
    </div>
  )
}
