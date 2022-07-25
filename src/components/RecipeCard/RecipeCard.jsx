import * as React from "react"
import { useState } from "react"
import { Alert } from "react-bootstrap" 
import timer from "../../icons/timer.png"
import like from "../../icons/like.png"
import heart from "../../icons/heart.png"
import axios from 'axios';
import "./RecipeCard.css"

import RecipeModal from "../RecipeModal/RecipeModal"
import HeartIcon from "../HeartIcon/HeartIcon"

export default function RecipeCard(props) {
  const recipeInfoUrl = "http://localhost:3001/apirecipeinfo/"
  const [recipeModelShow, setRecipeModalShow] = useState(false)
  const [isHeartClick, setIsHeartClick] = useState(false);
  const [error, setError] = useState("")
  const [modalError, setModalError] = useState("")
  const validMins = !(props.curRecipe.readyInMinutes == undefined || props.curRecipe.readyInMinutes.length == 0)
  const validLikes = !(props.curRecipe.aggregateLikes == undefined)
  const cuisine = props.curRecipe.cuisines[0] || props.curRecipe.dishTypes[0] || "meal"

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
        <img className="recipe-img" src={props.curRecipe.image} alt={`recipe for ${props.curRecipe.title}`} onClick={() => handleRecipeCardClick(true, props.curRecipe.id)}/>
        <div className="recipe-info">
          <div className="recipe-heading">
            <div className="recipe-title">
              <p className="recipe-cuisine">{cuisine.toUpperCase()}</p>
              <p className="recipe-name">{props.curRecipe.title}</p>
            </div>
            <HeartIcon/>
          </div>
          <div className="recipe-extra-info">
            {validMins && 
              <div className="recipe-time">
                <img className="timer-img" src={ timer } alt="timer icon" /> <p className="time-num">{props.curRecipe.readyInMinutes} mins</p>
              </div>
            }
            {validLikes &&
              <div className="recipe-likes">
                <p className="like-num">{props.curRecipe.aggregateLikes}</p> <img className="like-img" src={ like } alt="thumbs up icon" />
              </div>
            }
          </div>
        </div>
        {/* recipe modal */}
        <RecipeModal show={recipeModelShow} onHide={() => handleRecipeModal(false)} recipeInfo={props.recipeInfo} modalError={modalError} userDiets={props.userDiets} ingredientInfo={props.ingredientInfo} isIngredLoading={props.isIngredLoading} useRecipe={props.useRecipe} addIngredientToCart={props.addIngredientToCart}></RecipeModal>
    </div>
  )
}
