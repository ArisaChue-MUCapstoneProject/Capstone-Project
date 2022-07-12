import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, Button } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import "./Profile.css"

export default function Profile() {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

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
            <p>Email: {currentUser.email}</p>
            <Link to="/update-profile" className="btn btn-primary">Update Profile</Link>
          </Card.Body>
          <Button variant="link" onClick={handleLogOut}>Log Out</Button>
        </Card>
    </nav>
  )
}
