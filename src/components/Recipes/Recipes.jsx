import * as React from "react"
import { Link } from "react-router-dom"
import "./Recipes.css"

import RecipeCard from "../RecipeCard/RecipeCard"

export default function Recipes(props) {
  return (
    <nav className="recipes">
      <h2 className="recipes-heading">Recipes</h2>
      <div className="recipes-grid">
        {
          props.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} image={recipe.image} recipeModelShow={props.recipeModelShow} handleRecipeModal={props.handleRecipeModal} handleRecipeCardClick={props.handleRecipeCardClick} recipeInfo={props.recipeInfo}/>
          ))
        }
      </div>
    </nav>
  )
}
