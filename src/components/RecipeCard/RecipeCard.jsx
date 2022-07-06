import * as React from "react"
import "./RecipeCard.css"

export default function RecipeCard(props) {
    
  return (
    <div className="recipe-card">
        <img src={props.image} alt={`recipe image for ${props.title}`} />
      <p className="recipe-name">{props.title}</p>
    </div>
  )
}
