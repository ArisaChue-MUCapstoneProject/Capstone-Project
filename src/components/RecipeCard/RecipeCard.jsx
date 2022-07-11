import * as React from "react"
import "./RecipeCard.css"

import RecipeModal from "../RecipeModal/RecipeModal"

export default function RecipeCard(props) {
    
  return (
    <div className="recipe-card">
        {/* recipe card */}
        <img src={props.image} alt={`recipe for ${props.title}`} onClick={() => props.handleRecipeCardClick(true, props.id)}/>
        <p className="recipe-name">{props.title}</p>
        {/* recipe modal */}
        <RecipeModal show={props.recipeModelShow} onHide={() => props.handleRecipeModal(false)} recipeInfo={props.recipeInfo}></RecipeModal>
    </div>
  )
}
