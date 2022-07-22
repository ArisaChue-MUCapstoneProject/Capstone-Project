import * as React from "react"
import { useState, useEffect } from "react"
import { Alert } from "react-bootstrap" 
import axios from 'axios';
import { doc, updateDoc } from "firebase/firestore"
import "./Recipes.css"
import { db } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import RecipeCard from "../RecipeCard/RecipeCard"

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
  }, [userCart])

  const addIngredientToCart = (ingredientName) => {
    clearError()
    if (!ingredientName) {
      setError("ingredient was not found in recipe, please enter it manually")
    }
    // TODO: change quantity to something specific, change unit
    const newIngredient = {
      name: ingredientName,
      quantity: 2,
      unit: "gram"
    }
    setUserCart([...userCart, newIngredient])
  }

  return (
    <nav className="recipes">
      <h2 className="recipes-heading">Recipes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {recipes && recipes.length > 0 
        ? <div className="recipes-grid">
          {
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} image={recipe.image} userDiets={userDiets} recipes={recipes} addIngredientToCart={addIngredientToCart}/>
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
