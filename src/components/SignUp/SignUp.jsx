import * as React from "react"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { BsArrowRight } from 'react-icons/bs'
import { useAuth } from "../../contexts/AuthContext"
import "./SignUp.css"

export default function SignUp(props) {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup, currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      navigate("/signup/profile")
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="signup">
      <div className="signup-left">
      <p className="logo-signup">TasteIt</p>
        <div className="signup-content">
        <h2 className="signup-heading">Create an <span className="accent-signup">account</span></h2>
                <p className="signup-heading-sub">Join us so you can start <span className="accent-signup">saving food</span> right from your computer</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="signup-form">
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" ref={emailRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password must be at least 6 characters long" ref={passwordRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" placeholder="Enter password again" ref={passwordConfirmRef} required></Form.Control>
            </Form.Group>
            <Button disabled={loading} type="submit">Continue  <BsArrowRight /></Button>
          </Form>
          <p id="signup-login">Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
      <div className="signup-hero">
        <div className="signup-hero-text">
          <h1 className="signup-hero-heading">Welcome!</h1>
          <h3 className="signup-hero-heading-sub"><span className="accent-signup">TasteIt</span> tracks food you have at home and generates recipes that best use up your food</h3> 
          </div>
      </div>

    </div>
  )
}
