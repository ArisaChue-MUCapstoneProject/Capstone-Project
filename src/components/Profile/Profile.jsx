import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, Button, Badge, Alert, Form } from "react-bootstrap"
import Avatar from '@mui/material/Avatar'
import { Typeahead } from 'react-bootstrap-typeahead'
import { AiOutlineEdit } from 'react-icons/ai'
import { IoRefreshOutline } from 'react-icons/io5'
import { doc, updateDoc } from "firebase/firestore"
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import { stringAvatar, capitalizeName } from "../../utils/design"
import "./Profile.css"
import 'react-bootstrap-typeahead/css/Typeahead.css'
import CustomTooltip from "../CustomTooltip/CustomTooltip"

export default function Profile(props) {
  const apiAddressUrl = "http://localhost:3001/address/"
  const { logout, currentUser } = useAuth()
  const typeaheadDietsRef = useRef(null);
  const typeaheadAllergiesRef = useRef(null);
  const [userName, setUserName] = useState("")
  const [nameForm, setNameForm] = useState("")
  const [userProducts, setUserProducts] = useState([])
  const [userCart, setUserCart] = useState([])
  const [userPrimDiet, setUserPrimDiet] = useState("")
  const [userDiets, setUserDiets] = useState([])
  const [userAllergies, setUserAllergies] = useState([])
  const [userLocation, setUserLocation] = useState({})
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [error, setError] = useState("")
  // TODO: create a map -> key: each category, value: category info to combine to one
  const [showUserNameForm, setShowUserNameForm] = useState(false)
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

  const primDietDialogue = "Primary dietary restriction will filter out recipes that fail this restriction."
  const dietDialogue = "Secondary dietary restrictions will not filter out recipes that fail this restriction, but will show a warning at the top of recipe instructions."
  const allergyDialogue = "Allergy restrictions will filter all recipes that contain specified allergens."

  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.products && setUserProducts(userInfo.data.products)
      userInfo.data.cart && setUserCart(userInfo.data.cart)
      userInfo.data.primDiet && setUserPrimDiet(userInfo.data.primDiet)
      userInfo.data.diets && setUserDiets(userInfo.data.diets)
      userInfo.data.allergies && setUserAllergies(userInfo.data.allergies)
      userInfo.data.location && setUserLocation(userInfo.data.location)
      userInfo.data.name && setUserName(userInfo.data.name)
      setIsUserInfoLoading(false)
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

  // update products state
  useEffect(() => {
    // update products in the database
    if (!props.isLoading && userName) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, { name: userName })
        .catch(error => {
          setError(error.message)
        })
    }
  }, [userName])

  // update location in database
  useEffect(() => {
    // update location in the database
    if (!props.isLoading && userLocation) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, { location: userLocation })
        .catch(error => {
          setError(error.message)
        })
    }
  }, [userLocation])

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

  function showNameForm() {
    if (showUserNameForm) {
      // get clicked data
      setUserName(nameForm.toLowerCase())
      setNameForm("")
    }
    setShowUserNameForm(!showUserNameForm)
  }

  const handleNameFormChange = (event) => {
    setNameForm(event.target.value)
  }

  const handleLocationRefresh = async () => {
    try {
      setIsLocationLoading(true)
      if ("geolocation" in navigator) {
        var { data } = await axios(apiAddressUrl)
        setUserLocation(data)
        setIsLocationLoading(false)
      } else {
        setError("please enable location access to find closest sellers")
        setIsLocationLoading(false)
      }
    } catch (error) {
      setError(error.message)
      setIsLocationLoading(false)
    }
  }

  return (
    <div className="profile">
      {error && <Alert variant="danger">{error}</Alert>}
      <p className="profile-heading-sub">Edit your information, so we know exactly how to make your experience unique.</p>
      {!props.isLoading && !isUserInfoLoading
        ? <div>
          <div className="overlap">
            <Avatar id="profile-pfp"{...stringAvatar(userName)} />
            <div className="profile-content">
              <div className="profile-row">
                <div>
                  <p className="profile-sub-heading">Name:</p>
                  <div className="profile-sub-content">
                    {!showUserNameForm && <p className="overflow">{capitalizeName(userName)}</p>}
                    {showUserNameForm &&
                      <Form.Group controlId="formGroupName">
                        <Form.Control type="text" placeholder="Jane Doe" name="name" value={nameForm} onChange={handleNameFormChange} style={{ color: "var(--fontContent)" }} />
                      </Form.Group>

                    }
                    <Button variant="light" className="profile-button overflow" onClick={showNameForm}><AiOutlineEdit className="profile-icon"/></Button>
                  </div>
                </div>
                <div>
                  <div className="profile-diet-heading">
                    <p className="profile-sub-heading">Primary Dietary Restriction:</p>
                    <CustomTooltip dialogue={primDietDialogue} />
                  </div>

                  <div className="profile-sub-content">
                    {!showUserPrimDietForm &&
                      (userPrimDiet.length ? <p className="profile-list profile-item overflow">{userPrimDiet}</p> : <p>None</p>)
                    }
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
                    <Button variant="light" className="profile-button overflow" onClick={showPrimDietForm}><AiOutlineEdit className="profile-icon"/></Button>
                  </div>
                </div>
              </div>
              <div className="profile-row">
                <div>
                  <p className="profile-sub-heading">Email:</p>
                  <div className="profile-sub-content">
                    <p className="overflow">{currentUser.email}</p>
                    <Link to="/profile/update" className="btn btn-light profile-button overflow"><AiOutlineEdit className="profile-icon"/></Link>
                  </div>
                </div>
                <div>
                  <div className="profile-diet-heading">
                    <p className="profile-sub-heading">Secondary Dietary Restriction(s):</p>
                    <CustomTooltip dialogue={dietDialogue} />
                  </div>
                  <div className="profile-sub-content">
                    {!showUserDietsForm &&
                      (userDiets.length
                        ? <div className="profile-list profile-diets">
                          {
                            userDiets.map((diet) => (
                              <p key={diet} className="profile-item">{diet}</p>
                            ))
                          }
                        </div>
                        : <p>None</p>
                      )
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
                    <Button variant="light" className="profile-button overflow" onClick={showDietsForm}><AiOutlineEdit className="profile-icon"/></Button>
                  </div>
                </div>
              </div>
              <div className="profile-row">
                <div>
                  <p className="profile-sub-heading">Your Current Location:</p>
                  {!isLocationLoading
                    ? <div className="profile-sub-content">
                      <p className="overflow">{userLocation.city}, {userLocation.region} ({userLocation.flag.emoji})</p>
                      <Button variant="light" className="profile-button overflow" onClick={handleLocationRefresh}><IoRefreshOutline className="profile-icon"/></Button>
                    </div>
                    : <p>Loading</p>
                  }
                </div>
                <div>
                  <div className="profile-diet-heading">
                    <p className="profile-sub-heading">Allergies:</p>
                    <CustomTooltip dialogue={allergyDialogue} />
                  </div>

                  <div className="profile-sub-content">
                    {!showUserAllergiesForm &&
                      (userAllergies.length
                        ? <div className="profile-list profile-allergies">
                          {
                            userAllergies.map((allergy) => (
                              <p key={allergy} className="profile-item">{allergy}</p>
                            ))
                          }
                        </div>
                        : <p>None</p>
                      )
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
                    <Button variant="light" className="profile-button overflow" onClick={showAllergiesForm}><AiOutlineEdit className="profile-icon"/></Button>
                  </div>
                </div>
              </div>
              <div className="profile-row">
                <div>
                  <p className="profile-sub-heading">Products:</p>
                  <div className="profile-list profile-products profile-sub-content">
                    {
                      userProducts.map((product) => (
                        <p key={product.name} className="profile-item">{product.name}</p>
                      ))
                    }
                  </div>
                </div>
                <div>
                  <p className="profile-sub-heading">Shopping List:</p>
                  <div className="profile-list profile-cart profile-sub-content">
                    {
                      userCart.map((cart) => (
                        <p key={cart.name} className="profile-item">{cart.name}</p>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            <Button variant="link" className="profile-logout" onClick={handleLogOut}>Log Out</Button>
          </div>
          
        </div>
        : <p>Loading</p>

      }
    </div>
  )
}
