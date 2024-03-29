import * as React from "react"
import { useState, useEffect } from "react"
import { Alert } from "react-bootstrap"
import PacmanLoader from "react-spinners/PacmanLoader";
import axios from 'axios';
import { doc, updateDoc } from "firebase/firestore"
import "./Recipes.css"
import { db } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import { units, basicUnits, convertToStandard, updateStandardAmount, isVolumeUnit, UNIT_TYPE } from "../../utils/conversion"
import leftUtensil from "../../icons/leftutensil.png"
import rightUtensil from "../../icons/rightutensil.png"
import RecipeCard from "../RecipeCard/RecipeCard"
import RecipesHero from "../RecipesHero/RecipesHero"

export default function Recipes(props) {

  // get user data from the database
  const { currentUser } = useAuth()

  const listApiRecipesUrl = "http://localhost:3001/listapirecipes/"
  const [recipes, setRecipes] = useState([])
  const [userProducts, setUserProducts] = useState([])
  const [userCart, setUserCart] = useState([])
  const [userPrimDiet, setUserPrimDiet] = useState("")
  const [userDiets, setUserDiets] = useState([])
  const [userAllergies, setUserAllergies] = useState([])
  const [error, setError] = useState("")
  const [modalError, setModalError] = useState([])
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true)
  const [isRecipesLoading, setIsRecipesLoading] = useState(true)
  const [isIngredLoading, setIsIngredLoading] = useState(true)
  const [recipeInfo, setRecipeInfo] = useState({})
  const [ingredientInfo, setIngredientInfo] = useState([])
  const conversionFailure = "unable to convert amount"

  function clearError() {
    setError("")
  }

  function clearModalError() {
    setModalError([])
  }

  // update user data once page loads
  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.products && setUserProducts(userInfo.data.products)
      userInfo.data.cart && setUserCart(userInfo.data.cart)
      userInfo.data.primDiet && setUserPrimDiet(userInfo.data.primDiet)
      userInfo.data.diets && setUserDiets(userInfo.data.diets)
      userInfo.data.allergies && setUserAllergies(userInfo.data.allergies)
      setIsUserInfoLoading(false)
    }
  }, [props.isLoading])

  // get best recipe matches with user's information
  useEffect(() => {
    const fetchUserRecipes = async (isStandard) => {
      try {
        clearError()
        const sortParam = isStandard ? "popularity" : "max-used-ingredients"
        let customParams = "?"
        customParams += userProducts.length ? `ingredients=${userProducts.map((product) => (product.name)).join(",")}` : ""
        customParams += userPrimDiet.length ? `&diet=${userPrimDiet}` : ""
        customParams += userAllergies.length ? `&allergies=${userAllergies.join(",")}` : ""

        const recipeApiIngredients = listApiRecipesUrl + sortParam + customParams
        var { data } = await axios(recipeApiIngredients)
        setRecipes(data.results)
        setIsRecipesLoading(false)
      } catch (err) {
        setError(err.message)
      }
    }

    if (!isUserInfoLoading && !props.isLoading) {
      if (userProducts.length == 0) {
        fetchUserRecipes(true)    // user has no products in pantry -> get standard recipes
      } else {
        fetchUserRecipes(false)   // user has products in pantry
      }
    }

  }, [isUserInfoLoading, props.isLoading, userProducts])

  // update carts in database
  useEffect(() => {
    if (!props.isLoading && userCart) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, { cart: userCart })
        .catch(error => {
          setError(error.message)
        })
    }
  }, [props.isLoading, userCart])

  // update user's products in database
  useEffect(() => {
    if (!props.isLoading && userProducts) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, { products: userProducts })
        .catch(error => {
          setError(error.message)
        })
    }
  }, [props.isLoading, userProducts])

  // TODO: how to deal with plurals?
  // look to see if 1) user has ingredient 2) user has enough amount
  const checkIngredientEnough = (ingredient) => {
    const ingredientName = ingredient.nameClean || ingredient.name
    const ingredWords = new Set(ingredientName.split(" ").map(word => word.toLowerCase()))
    let userIngredient = userProducts.find(prod => ingredWords.has(prod.name))
    // user doesn't have ingredient
    if (!userIngredient) {
      return null
    }
    let recipeIngredAmount = convertToStandard(ingredient.unit, ingredient.amount)  // return logic: [ unit type, amount in grams/mL/non-measureable unit ]
    // trying to convert different unit types
    if (recipeIngredAmount[0] != userIngredient.unitType) {
      return [ingredient.id, userIngredient.name, conversionFailure, null]
    }
    var message = "you do not have enough"
    // find how much user will have after they use ingredient
    if (userIngredient.quantity >= recipeIngredAmount[1]) {
      const unitName = userIngredient.unitType == UNIT_TYPE.VOLUME ? "milliliters" : userIngredient.unitType == UNIT_TYPE.WEIGHT ? "grams" : "counts"
      message = `you will have ${userIngredient.quantity - recipeIngredAmount[1]} ${unitName} left`
    }
    return [ingredient.id, userIngredient.name, message, userIngredient.quantity - recipeIngredAmount[1]]
  }

  // when recipeInfo gets updated by RecipeCard
  useEffect(() => {
    // ingredient list exist
    if (recipeInfo && recipeInfo.extendedIngredients != undefined) {
      // curIngredientInfo = array of recipe ingredient user has, regardless if they don't have enough
      const curIngredientInfo = (recipeInfo.extendedIngredients.map(checkIngredientEnough)).filter(val => val)
      setIngredientInfo(curIngredientInfo)
      setIsIngredLoading(false)
    }
  }, [recipeInfo])

  const addIngredientToCart = (ingredientName, cat, amount, amountUnit) => {
    clearModalError()
    if (!ingredientName) {
      setModalError(["ingredient was not found in recipe, please enter it manually"])
      return
    }
    ingredientName = ingredientName.toLowerCase()
    if (amount == undefined || amount < 0) {
      amount = 0
    }
    if (amountUnit == undefined) {
      amountUnit = "count"
    }
    const quantityAmount = convertToStandard(amountUnit, Number(amount))

    let newCart = userCart.map(i => ({ ...i }))
    let itemIndex = newCart.findIndex(item => item.name === ingredientName)
    // item doesn't exist yet in grocery list
    if (itemIndex == -1) {
      const newIngredient = {
        name: ingredientName,
        quantity: quantityAmount[1],
        unitType: quantityAmount[0],
        category: cat
      }
      newCart.push(newIngredient)
      setUserCart(newCart)
    } else {
      // error handling: adding two different unit types
      if (newCart[itemIndex].unitType != quantityAmount[0]) {
        let errorStrings = [`The units for [${ingredientName}] are not consistent with your previous entries in your grocery list.`]
        let secondMessage = "Please make sure you are adding a ["
        secondMessage += newCart[itemIndex].unitType == UNIT_TYPE.VOLUME ? "volume" : newCart[itemIndex].unitType == UNIT_TYPE.WEIGHT ? "weight" : "count/misc"
        secondMessage += "] unit type"
        errorStrings.push(secondMessage)
        setModalError(errorStrings)
      } else {
        newCart[itemIndex].quantity += quantityAmount[1]
        setUserCart(newCart)
      }
    }

  }

  // on click function on recipe modal that decreases user's products amount
  function useRecipe() {
    // ingredientInfo = [ id, name in userProducts, message, amount left ]
    const newProductAmounts = userProducts.map(function (ingredient) {
      let curIngred = ingredientInfo.find(ingd => ingd[1] == ingredient.name)
      // matched ingredient is no longer in user's database (lost somewhere)
      if (!curIngred) {
        setError(`could not adjust ${ingredient.name}'s amount`)
        return { ...ingredient }
      }
      else if (curIngred[2] != conversionFailure) {
        if (curIngred[3] > 0) {
          return {
            name: ingredient.name,
            quantity: curIngred[3],
            unitType: ingredient.unitType,
            category: ingredient.category
          }
        } // else don't push anything since product would be used up
      } else { // don't modify product since conversion failed
        return { ...ingredient }
      }
    }).filter(val => val)
    setUserProducts(newProductAmounts)
  }

  return (
    <div className="recipes">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="recipes-hero">
        <RecipesHero userProducts={userProducts} />
      </div>
      {recipes && recipes.length > 0
        ? <div className="recipes-grid">
          {
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} id={recipe.id} curRecipe={recipe} userDiets={userDiets} recipes={recipes} setRecipeInfo={setRecipeInfo} recipeInfo={recipeInfo} ingredientInfo={ingredientInfo} setIsIngredLoading={setIsIngredLoading} isIngredLoading={isIngredLoading} useRecipe={useRecipe} addIngredientToCart={addIngredientToCart} modalError={modalError} setModalError={setModalError}/>
            ))
          }
        </div>
        : isRecipesLoading
          ? <PacmanLoader color="var(--green3)" loading={isRecipesLoading} size={35} className="loader" />
          : <p>Please decrease your restrictions</p>
      }
    </div>
  )
}
