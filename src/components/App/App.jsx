import Navbar from "../Navbar/Navbar"
import SignUp from "../SignUp/SignUp"
import LogIn from "../LogIn/LogIn"
import ForgotPass from "../ForgotPass/ForgotPass"
import PrivateRoute from "../PrivateRoute/PrivateRoute"
import Profile from "../Profile/Profile"
import UpdateProfile from "../UpdateProfile/UpdateProfile"
import Recipes from "../Recipes/Recipes"
import Pantry from "../Pantry/Pantry"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import { AuthProvider } from "../../contexts/AuthContext";
import { db } from "../../firebase"
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import axios from 'axios';

export default function App() {

  //TODO: move component specific code into components

  const listRecipeUrl = "http://localhost:3001/apirecipes/"
  const recipeInfoUrl = "http://localhost:3001/apirecipeinfo/"

// state variables
const [products, setProducts] = useState([])
const [recipeModelShow, setRecipeModalShow] = useState(false)
const [recipeInfo, setRecipeInfo] = useState({})
const [recipes, setRecipes] = useState([])
const [users, setUsers] = useState([])

// get best recipe matches with user's food items
useEffect(() => {
  async function fetchData() {
    try {
      // API parameter format: ingredient,+ingredient,+ingredient
      let ingredientParams = products.map((product) => (product.name)).join(",+")
      const recipeApiIngredients = listRecipeUrl + ingredientParams
      var { data } = await axios(recipeApiIngredients)
      setRecipes(data)
    } catch (err) {
      //TODO: error handling
      console.log("error in fetching from backend")
    }
  }
  if (products.length > 0) {
    fetchData()
  }
}, [products])

// listen for realtime updates and update users
useEffect(() => {
  const userCollectionRef = collection(db, "users")
  const unsubscribe = onSnapshot(userCollectionRef, snapshot => {
    setUsers(snapshot.docs.map(doc => ({
      uid: doc.id,
      data: doc.data()
    })))
  })

  return () => {
      unsubscribe()
  }
}, [])

// onclick function for each recipe card
const handleRecipeCardClick = async (showStatus, recipeId) => {
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
    //TODO: error handling
    console.log("error in fetching from backend")
  }
  
}

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <main>
            <Navbar />
            <Routes>
              <Route path="/signup" element={<SignUp />}/>
              <Route path="/login" element={<LogIn />}/>
              <Route path="/forgot-password" element={<ForgotPass />}/>
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}/>
              <Route path="/recipes" element={<PrivateRoute><Recipes recipeInfo={recipeInfo} handleRecipeCardClick={handleRecipeCardClick} handleRecipeModal={handleRecipeModal} recipeModelShow={recipeModelShow} recipes={recipes}/></PrivateRoute>}/>
              <Route path="/pantry" element={<PrivateRoute><Pantry setProducts={setProducts} users={users}/></PrivateRoute>}/>
              <Route path="/shoppingcart" element={<PrivateRoute><ShoppingCart /></PrivateRoute>}/>
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
