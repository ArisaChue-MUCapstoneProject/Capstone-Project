import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { Button, Card, Alert, Form } from "react-bootstrap"
import PacmanLoader from "react-spinners/PacmanLoader";
import { Typeahead } from 'react-bootstrap-typeahead'
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import CustomTooltip from "../CustomTooltip/CustomTooltip"
import "./SignUpProfile.css"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default function SignUpProfile(props) {
    const apiAddressUrl = "http://localhost:3001/address/"
    // get user data from the database
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const primDiets = ["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescetarian", "Paleo"]
    const [diets, setDiets] = useState(["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescetarian", "Paleo"])
    const [primDietChecked, setPrimDietChecked] = useState([])
    const [dietsChecked, setDietsChecked] = useState([])
    const allergies = ["Diary", "Peanut", "Soy", "Egg", "Shellfish", "Tree Nut", "Gluten"]
    const [allergiesChecked, setAllergiesChecked] = useState([])
    const [error, setError] = useState("")
    const [userLocation, setUserLocation] = useState({})
    const [isLocationLoading, setIsLocationLoading] = useState(true)
  const [nameForm, setNameForm] = useState("")

  const primDietDialogue = "Primary dietary restriction will filter out recipes that fail this restriction."
  const dietDialogue = "Secondary dietary restrictions will not filter out recipes that fail this restriction, but will show a warning at the top of recipe instructions."
  const allergyDialogue = "Allergy restrictions will filter all recipes that contain specified allergens."

    // get location every render
    useEffect(() => {
        try {
            getLocation()
        } catch (error) {
            setError(error.message)
        }
    }, [])

    // continue editing diets so secondary diet options don't show primary diet
    useEffect(() => {
        setDiets(primDiets.filter(val => {
            return val != primDietChecked
        }))
    }, [primDietChecked])

    // update diet and allergies into database
    const handleMakeProfile = async (e) => {
        setLoading(true)
        // get clicked data
        const userPrimDiets = primDietChecked.map(val =>
            val == "Gluten Free" ? "gluten-free" : val.toLowerCase()
        )
        const userDiets = dietsChecked.map(val =>
            val.toLowerCase()
        )
        const userAllergies = allergiesChecked.map(val =>
            val.toLowerCase()
        )
        // TODO: check they put in two words
        const userName = nameForm.toLowerCase()
        // update user profile in the database
        const userProfile = {
            primDiet: userPrimDiets,
            diets: userDiets,
            allergies: userAllergies,
            location: userLocation,
            name: userName
        }
        const docRef = doc(db, "users", currentUser.uid)
        const promises = []
        promises.push(
            updateDoc(docRef, userProfile)
                .catch(error => {
                    setError(error.message)
                })
        )
        Promise.all(promises)
            .then(() => {
                navigate("/profile")
            })
            .catch(() => {
                setError("failed to update account")
            }).finally(() => {
                setLoading(false)
            })
    }

    const handleNameFormChange = (event) => {
        setNameForm(event.target.value)
      }

    // get user's current location
    async function getLocation() {
        if ("geolocation" in navigator) {
            var { data } = await axios(apiAddressUrl)
            setUserLocation(data)
            setIsLocationLoading(false)
        } else {
            setError("please enable location access to find closest sellers")
            setIsLocationLoading(false)
        }
    }

    return (
        <div className="signup-profile">
            <div className="signup-profile-left">
                <p className="logo-signup">TasteIt</p>
                <div className="signup-profile-content">
                    <h2 className="signup-profile-heading">Tell us a little about <span className="accent-signup">yourself</span></h2>
                    <p className="signup-profile-heading-sub">The more information, the more personalized your experience will be</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <div className="signup-profile-form">
                        <div>
                            <p className="signup-profile-form-heading">First and last name?</p>
                        <Form.Group controlId="formGroupName">
                        <Form.Control type="text" placeholder="Jane Doe" name="name" value={nameForm} onChange={handleNameFormChange} style={{ color: "var(--fontContent)" }} />
                      </Form.Group>
                        </div>
                        <div>
                            <div className="signup-form-heading">
                            <p className="signup-profile-form-heading">Primary Dietary Restriction?</p>
                            <CustomTooltip dialogue={primDietDialogue} />
                            </div>
                            <Typeahead
                                id="checkbox-primary-diet"
                                labelKey="diets"
                                onChange={setPrimDietChecked}
                                options={primDiets}
                                placeholder="Customize your primary diet..."
                                selected={primDietChecked}
                            />
                        </div>
                        <div>
                            <div className="signup-form-heading">
                            <p className="signup-profile-form-heading">Other Dietary Restrictions?</p>
                            <CustomTooltip dialogue={dietDialogue} />
                            </div>
                            <Typeahead
                                id="checkbox-diets"
                                labelKey="diets"
                                multiple
                                onChange={setDietsChecked}
                                options={diets}
                                placeholder="Customize your secondary diets..."
                                selected={dietsChecked}
                            />
                        </div>
                        <div>
                            <div className="signup-form-heading">
                            <p className="signup-profile-form-heading">Allergies?</p>
                            <CustomTooltip dialogue={allergyDialogue} />
                            </div>
                            <Typeahead
                                id="checkbox-diets"
                                labelKey="allergies"
                                multiple
                                onChange={setAllergiesChecked}
                                options={allergies}
                                placeholder="Customize your allergies..."
                                selected={allergiesChecked}
                            />
                        </div>
                        <div>
                            {userLocation && !isLocationLoading
                                ? <div className="signup-profile-location">
                                    <p className="signup-location">Your Current Location:</p>
                                    <p>{userLocation.city}, {userLocation.region} ({userLocation.flag.emoji})</p>
                                </div>
                                : <PacmanLoader color="var(--green3)" loading={userLocation || !isLocationLoading} size={35} className="loader"/>
                            }
                        </div>
                        <Button disabled={loading} onClick={handleMakeProfile}>Create your account</Button>
                    </div>

                </div>
            </div>
            <div className="signup-profile-hero">
                <div className="signup-profile-hero-text">
                    <h1 className="signup-profile-hero-heading">A little about <span className="accent-signup">us</span></h1>
                    <h3 className="signup-profile-hero-heading-sub"><span className="accent-signup">TasteIt</span> also helps build your grocery list and locate local sellers that might have what you want</h3>
                </div>
            </div>
        </div>
    )
}
