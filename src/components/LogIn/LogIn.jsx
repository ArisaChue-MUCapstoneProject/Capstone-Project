import * as React from "react"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Card, Alert } from "react-bootstrap" 
import { useAuth } from "../../contexts/AuthContext"
import "./LogIn.css"

export default function LogIn(props) {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login} = useAuth()
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
            <Card>
            <Card.Body>
                <h2>Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required></Form.Control>
                </Form.Group>
                <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required></Form.Control>
                </Form.Group>
                <Button disabled={loading} type="submit">Log In</Button>
                </Form>
                <Link to="/forgot-password">Forgot Password?</Link>
            </Card.Body>
            </Card>
            <p>Need an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    )
}
