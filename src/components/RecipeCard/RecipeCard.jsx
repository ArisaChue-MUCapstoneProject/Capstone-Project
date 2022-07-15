import * as React from "react"
import { useState } from "react"
import { Alert } from "react-bootstrap" 
import axios from 'axios';
import "./RecipeCard.css"

import RecipeModal from "../RecipeModal/RecipeModal"

export default function RecipeCard(props) {
  const recipeInfoUrl = "http://localhost:3001/apirecipeinfo/"
  const [recipeModelShow, setRecipeModalShow] = useState(false)
  const [recipeInfo, setRecipeInfo] = useState({})
  const [error, setError] = useState("")

  // onclick function for each recipe card
  const handleRecipeCardClick = async (showStatus, recipeId) => {
    setError("")
    await handleGetRecipeInstructions(recipeId)
    handleRecipeModal(showStatus)
  }

  // pop up recipe modal for specific recipe card
  const handleRecipeModal = (showStatus) => {
    setRecipeModalShow(showStatus)
  }

  // extract recipe info from backend for recipe modal
  const handleGetRecipeInstructions = async (recipeId) => {
    try {
      var { data } = await axios(recipeInfoUrl + recipeId)
      setRecipeInfo(data)
    } catch (error) {
      setError(error.message)
    }
    
  }

  return (
    <div className="recipe-card">
        {/* recipe card */}
        {error && <Alert variant="danger">{error}</Alert>}
        <img src={props.image} alt={`recipe for ${props.title}`} onClick={() => handleRecipeCardClick(true, props.id)}/>
        <p className="recipe-name">{props.title}</p>
        {/* recipe modal */}
        <RecipeModal show={recipeModelShow} onHide={() => handleRecipeModal(false)} recipeInfo={recipeInfo}></RecipeModal>
    </div>
  )
}
