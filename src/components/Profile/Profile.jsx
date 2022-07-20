import * as React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, Button, Badge } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./Profile.css"

export default function Profile(props) {
  const { logout, currentUser } = useAuth()
  const [userProducts, setUserProducts] = useState([])
  const [userCart, setUserCart] = useState([])
  const [userPrimDiet, setUserPrimDiet] = useState("")
  const [userDiets, setUserDiets] = useState([])
  const [userAllergies, setUserAllergies] = useState([])
  const [error, setError] = useState("")
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
            </div>
          </Card.Body>
          <Button variant="link" onClick={handleLogOut}>Log Out</Button>
        </Card>
    </nav>
  )
}
