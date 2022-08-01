import * as React from "react"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import loginBackground from "../../icons/login_home.jpeg"
import "./LogIn.css"

export default function LogIn(props) {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/profile")
        } catch (error) {
            setError(error.message)
        }
        setLoading(false)
    }

    return (
        <div className="login">
            <div className="login-hero">
                <div className="login-hero-text">
                <h1 className="login-hero-heading">Hello!</h1>
                <h3 className="login-hero-heading-sub">Start your journey of</h3> 
                <h3 className="login-hero-heading-sub"><span className="accent">Tasting It</span>, not <span className="accent">Wasting It</span></h3>
                </div>
            </div>
            <div className="login-right">
                <div className="login-content">
                <h2 className="login-heading">Welcome Back</h2>
                <p className="login-heading-sub">Thanks for coming back, please enter your details</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form className="login-form" onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required></Form.Control>
                        </Form.Group>
                        <Link to="/forgot-password" id="login-forgot">Forgot Password?</Link>
                        <Button disabled={loading} type="submit">Log In</Button>
                    </Form>
                    <p id="login-signup">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
                    
            </div>
        </div>
    )
}
