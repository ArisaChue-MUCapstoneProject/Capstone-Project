import * as React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Alert } from "react-bootstrap" 
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./SignUpProfile.css"

export default function SignUpProfile(props) {
    // get user data from the database
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const diets = ["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescetarian", "Paleo"]
    const [dietChecked, setDietChecked] = useState([false, false, false, false, false, false])
    const allergies = ["Diary", "Peanut", "Soy", "Egg", "Shellfish", "Tree Nut", "Gluten"]
    const [allergiesChecked, setAllergiesChecked] = useState([false, false, false, false, false, false, false]);
    const [error, setError] = useState("")

    const handleDietClick = (index) => {
        let newChecked = [...dietChecked]
        newChecked[index] = !newChecked[index]
        setDietChecked(newChecked)
    }

    const handleAllergiesClick = (index) => {
        let newChecked = [...allergiesChecked]
        newChecked[index] = !newChecked[index]
        setAllergiesChecked(newChecked)
    }
    
    const handleMakeProfile = async (e) => {
        setLoading(true)
        // get clicked data
        const userDiets = diets.filter((val, ind) => {
            return val && dietChecked[ind]
        })
        const userAllergies = allergies.filter((val, ind) => {
            return val && allergiesChecked[ind]
        })
        // update user profile in the database
        const userProfile = {
            diet: userDiets,
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
                {diets.map((value, index) => {
                    return <Button key={index} variant={dietChecked[index] ? "primary" : "secondary"} onClick={() => handleDietClick(index)}>
                        {value}
                    </Button>})}
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
                <p>Allergies?</p>
                {allergies.map((value, index) => {
                    return <Button key={index} variant={allergiesChecked[index] ? "primary" : "secondary"} onClick={() => handleAllergiesClick(index)}>
                        {value}
                    </Button>})}
            </Card.Body>
          </Card>
          <Button disabled={loading} onClick={handleMakeProfile}>Sign Up</Button>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    )
}
