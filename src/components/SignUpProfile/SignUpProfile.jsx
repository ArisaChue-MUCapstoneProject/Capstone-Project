import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { Button, Card, Alert } from "react-bootstrap" 
import { Typeahead } from 'react-bootstrap-typeahead'
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./SignUpProfile.css"
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default function SignUpProfile(props) {
    const apiAddressUrl = "http://localhost:3001/address/"
    // get user data from the database
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const typeaheadRef = useRef(null);
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
        // update user profile in the database
        const userProfile = {
            primDiet: userPrimDiets,
            diets: userDiets,
            allergies: userAllergies,
            location: userLocation
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
      <div className="sign-up-profile">
        <h1>Tell us a little about yourself</h1>
        {error && <Alert variant="danger">{error}</Alert>}
          <Card>
            <Card.Body>
                <p>Primary Dietary Restriction?</p>
                <Typeahead
                    id="checkbox-primary-diet"
                    labelKey="diets"
                    onChange={setPrimDietChecked}
                    options={primDiets}
                    placeholder="Customize your primary diet..."
                    selected={primDietChecked}
                />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
                <p>Other Dietary Restrictions?</p>
                <Typeahead
                    id="checkbox-diets"
                    labelKey="diets"
                    multiple
                    onChange={(selected) => {
                        setDietsChecked(selected);
                        // Keep the menu open when making multiple selections
                        typeaheadRef.current.toggleMenu();
                      }}
                    options={diets}
                    placeholder="Customize your secondary diets..."
                    selected={dietsChecked}
                    ref={typeaheadRef}
                />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
                <p>Allergies?</p>
                <Typeahead
                    id="checkbox-diets"
                    labelKey="allergies"
                    multiple
                    onChange={setAllergiesChecked}
                    options={allergies}
                    placeholder="Customize your allergies..."
                    selected={allergiesChecked}
                />
            </Card.Body>
          </Card>
          {userLocation && !isLocationLoading
            ? <Card>
                <Card.Body>
                    <p>Your Current Location:</p>
                    <p>{userLocation.city}, {userLocation.region} ({userLocation.flag.emoji})</p>
                </Card.Body>
            </Card>
            : <p>Loading Location</p>
          }
          <Button disabled={loading} onClick={handleMakeProfile}>Sign Up</Button>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    )
}
