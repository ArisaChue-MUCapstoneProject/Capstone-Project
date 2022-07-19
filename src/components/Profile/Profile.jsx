import * as React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, Button } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./Profile.css"

export default function Profile(props) {
  const { logout, currentUser } = useAuth()
  const [userProducts, setUserProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!props.isLoading) {
      var curuser = props.users.find(u => u.uid === currentUser.uid)
      setUserProducts(curuser.data.products)
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
            <p>Username:</p>
            <p>{currentUser.email}</p>
            <p>Products:</p>
            <p>{!props.isLoading && userProducts && userProducts.length}</p>
            <Link to="/profile/update" className="btn btn-primary">Update Profile</Link>
          </Card.Body>
          <Button variant="link" onClick={handleLogOut}>Log Out</Button>
        </Card>
    </nav>
  )
}
