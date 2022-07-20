import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, Button, Badge } from "react-bootstrap"
import { Typeahead } from 'react-bootstrap-typeahead'
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./Profile.css"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default function Profile(props) {
  const { logout, currentUser } = useAuth()
  const typeaheadDietsRef = useRef(null);
  const typeaheadAllergiesRef = useRef(null);
  const [userProducts, setUserProducts] = useState([])
  const [userCart, setUserCart] = useState([])
  const [userPrimDiet, setUserPrimDiet] = useState("")
  const [userDiets, setUserDiets] = useState([])
  const [userAllergies, setUserAllergies] = useState([])
  const [error, setError] = useState("")
  const [showUserPrimDietForm, setShowUserPrimDietForm] = useState(false)
  const primDiets = ["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescetarian", "Paleo"]
  const [primDietChecked, setPrimDietChecked] = useState([])
  const [showUserDietsForm, setShowUserDietsForm] = useState(false)
  const [diets, setDiets] = useState(["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescetarian", "Paleo"])
  const [dietsChecked, setDietsChecked] = useState([])
  const [showUserAllergiesForm, setShowUserAllergiesForm] = useState(false)
  const allergies = ["Diary", "Peanut", "Soy", "Egg", "Shellfish", "Tree Nut", "Gluten"]
  const [allergiesChecked, setAllergiesChecked] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.products && setUserProducts(userInfo.data.products)
      userInfo.data.cart && setUserCart(userInfo.data.cart)
      userInfo.data.primDiet && setUserPrimDiet(userInfo.data.primDiet)
      userInfo.data.diets && setUserDiets(userInfo.data.diets)
      userInfo.data.allergies && setUserAllergies(userInfo.data.allergies)
    }
  }, [props.isLoading])

  const handleLogOut = async () => {
    try {
      await logout()
      navigate("/login")
    } catch {
      console.log("fail to logout")
    }
  }

  // continue editing diets so secondary diet options don't show primary diet
  useEffect(() => {
    setDiets(primDiets.filter(val => {
        return val.toLowerCase() != userPrimDiet
    }))
  }, [userPrimDiet])

  function showPrimDietForm() {
    if (showUserPrimDietForm) {
      // get clicked data
      const newUserPrimDiet = primDietChecked.map(val => 
        val == "Gluten Free" ? "gluten-free" : val.toLowerCase()
      )
      setUserPrimDiet(newUserPrimDiet)
      const docRef = doc(db, "users", currentUser.uid)
        updateDoc(docRef, { primDiet: newUserPrimDiet })
        .catch(error => {
            setError(error.message)
      })
      setPrimDietChecked([])
    }
    setShowUserPrimDietForm(!showUserPrimDietForm)
  }

  function showDietsForm() {
    if (showUserDietsForm) {
      // get clicked data
      const newUserDiets = dietsChecked.map(val => 
        val.toLowerCase()
      )
      setUserDiets(newUserDiets)
      const docRef = doc(db, "users", currentUser.uid)
        updateDoc(docRef, { diets: newUserDiets })
        .catch(error => {
            setError(error.message)
      })
      setDietsChecked([])
    }
    setShowUserDietsForm(!showUserDietsForm)
  }

  function showAllergiesForm() {
    if (showUserAllergiesForm) {
      // get clicked data
      const newUserAllergies = allergiesChecked.map(val => 
        val.toLowerCase()
      )
      setUserAllergies(newUserAllergies)
      const docRef = doc(db, "users", currentUser.uid)
        updateDoc(docRef, { allergies: newUserAllergies })
        .catch(error => {
            setError(error.message)
      })
      setAllergiesChecked([])
    }
    setShowUserAllergiesForm(!showUserAllergiesForm)
  }

  return (
    <nav className="profile">
        <Card>
          <Card.Body>
            <h2>Profile</h2>
            <div>
              <p>Username:</p>
              <p>{currentUser.email}</p>
            </div>
            <Link to="/profile/update" className="btn btn-primary">Update Username/Password</Link>
            <div>
              <p>Products:</p>
              {!props.isLoading && 
                <div className="profile-products">
                {
                  userProducts.map((product) => (
                    <Badge pill bg="secondary" key={product.name}>{product.name}</Badge>
                  ))
                }
              </div>
              }
            </div>
            <div>
              <p>Shopping List:</p>
              {!props.isLoading && 
                <div className="profile-cart">
                {
                  userCart.map((cart) => (
                    <Badge pill bg="secondary" key={cart.name}>{cart.name}</Badge>
                  ))
                }
              </div>
              }
            </div>
            <div>
              <p>Primary Dietary Restriction</p>
              {!props.isLoading && userPrimDiet.length ? <Badge pill bg="secondary">{userPrimDiet}</Badge>: <Badge pill bg="secondary">none</Badge> }
              {showUserPrimDietForm && 
                <Typeahead
                      id="checkbox-primary-diet"
                      labelKey="diets"
                      onChange={setPrimDietChecked}
                      options={primDiets}
                      placeholder="Change your primary diet..."
                      selected={primDietChecked}
                  />
                }
                <Button onClick={showPrimDietForm}>Change Me</Button>
            </div>
            <div>
              <p>Secondary Dietary Restriction(s):</p>
              {!props.isLoading && userDiets.length 
                ? <div className="profile-diets">
                {
                  userDiets.map((diet) => (
                    <Badge pill bg="secondary" key={diet}>{diet}</Badge>
                  ))
                }
                </div>
                : <p>none</p>
              }
              {showUserDietsForm && 
                <Typeahead
                  id="checkbox-diets"
                  labelKey="diets"
                  multiple
                  onChange={(selected) => {
                      setDietsChecked(selected);
                      // Keep the menu open when making multiple selections
                      typeaheadDietsRef.current.toggleMenu();
                    }}
                  options={diets}
                  placeholder="Change your secondary diets..."
                  selected={dietsChecked}
                  ref={typeaheadDietsRef}
                />
                }
                <Button onClick={showDietsForm}>Change Me</Button>
            </div>
            <div>
              <p>Allergies:</p>
              {!props.isLoading && userAllergies.length 
                ? <div className="profile-allergies">
                {
                  userAllergies.map((allergy) => (
                    <Badge pill bg="secondary" key={allergy}>{allergy}</Badge>
                  ))
                }
                </div>
                : <p>none</p>
              }
              {showUserAllergiesForm && 
                <Typeahead
                  id="checkbox-diets"
                  labelKey="diets"
                  multiple
                  onChange={(selected) => {
                      setAllergiesChecked(selected);
                      // Keep the menu open when making multiple selections
                      typeaheadAllergiesRef.current.toggleMenu();
                    }}
                  options={allergies}
                  placeholder="Change your allergies..."
                  selected={allergiesChecked}
                  ref={typeaheadAllergiesRef}
                />
                }
                <Button onClick={showAllergiesForm}>Change Me</Button>
            </div>
          </Card.Body>
          <Button variant="link" onClick={handleLogOut}>Log Out</Button>
        </Card>
    </nav>
  )
}
