import * as React from "react"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap"
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
        <div className="signup-content">
        <h2 className="signup-heading">Create an account</h2>
                <p className="signup-heading-sub">Let's get started with a few credentials</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="signup-form">
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" ref={emailRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Create password" ref={passwordRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" placeholder="Enter password again" ref={passwordConfirmRef} required></Form.Control>
            </Form.Group>
            <Button disabled={loading} type="submit">Continue</Button>
          </Form>
          <p id="signup-login">Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
      <div className="signup-hero">
        <div className="signup-hero-text">
          <h1 className="signup-hero-heading">Welcome!</h1>
          <h3 className="signup-hero-heading-sub">Join us to start saving food right from your computer</h3> </div>

      </div>

    </div>
  )
}
