import * as React from "react"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import "./ForgotPass.css"

export default function ForgotPass() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Check your inbox for further instructions")
        } catch (error) {
            setError(error.message)
        }
        setLoading(false)
    }

    return (
        <div className="forgot-pass">
            <div className="forgot-hero">
                <div className="forgot-hero-text">
                    <h1 className="forgot-hero-heading">Hello!</h1>
                    <h3 className="forgot-hero-heading-sub">Start your journey of</h3>
                    <h3 className="forgot-hero-heading-sub"><span className="accent">Tasting It</span>, not <span className="accent">Wasting It</span></h3>
                </div>
            </div>
            <div className="forgot-right">
                <div className="forgot-content">
                    <h2 className="forgot-heading">Forgot your <span className="accent-signup">password?</span></h2>
                    <p className="forgot-heading-sub">Don't worry, enter your email and we'll send you an email to reset your password</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit} className="forgot-form">
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="name@example.come" ref={emailRef} required></Form.Control>
                        </Form.Group>
                        <Button disabled={loading} type="submit">Reset</Button>
                    </Form>
                    <div className="forgot-links">
                    <p id="forgot-links">Got your password? <Link to="/login">Log In</Link></p>
                    <p id="forgot-links">Need an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
