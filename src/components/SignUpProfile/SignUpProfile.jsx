import * as React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Alert } from "react-bootstrap" 
import { Typeahead } from 'react-bootstrap-typeahead'
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./SignUpProfile.css"
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default function SignUpProfile(props) {
    // get user data from the database
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const diets = ["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescetarian", "Paleo"]
    const [dietsChecked, setDietsChecked] = useState([])
    const allergies = ["Diary", "Peanut", "Soy", "Egg", "Shellfish", "Tree Nut", "Gluten"]
    const [allergiesChecked, setAllergiesChecked] = useState([])
    const [error, setError] = useState("")
    
    const handleMakeProfile = async (e) => {
        setLoading(true)
        // get clicked data
        const userDiets = dietsChecked.map(val => 
            val == "Gluten Free" ? "gluten-free" : val.toLowerCase()
        )
        const userAllergies = allergiesChecked.map(val => 
            val.toLowerCase()
        )
        // update user profile in the database
        const userProfile = {
            diets: userDiets,
            allergies: userAllergies
        }
        const docRef = doc(db, "users", currentUser.uid)
        updateDoc(docRef, userProfile)
        .catch(error => {
            setError(error.message)
        })
        navigate("/profile")
        setLoading(false)
    }

    return (
      <div className="sign-up-profile">
        <h1>Tell us a little about yourself</h1>
        {error && <Alert variant="danger">{error}</Alert>}
          <Card>
            <Card.Body>
                <p>Dietary Restrictions?</p>
                <Typeahead
                    id="checkbox-diets"
                    labelKey="diets"
                    multiple
                    onChange={setDietsChecked}
                    options={diets}
                    placeholder="Customize your diet..."
                    selected={dietsChecked}
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
          <Button disabled={loading} onClick={handleMakeProfile}>Sign Up</Button>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    )
}
