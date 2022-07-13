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

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setMessage("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Check your inbox for further instructions")
        } catch {
            //TODO: error handling
            console.log("Failed to reset password")
        }
        setLoading(false)
    }

    return (
        <div className="home">
            <Card>
            <Card.Body>
                <h2>Reset Password</h2>
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required></Form.Control>
                </Form.Group>
                <Button disabled={loading} type="submit">Reset</Button>
                </Form>
                <Link to="/login">Login</Link>
            </Card.Body>
            </Card>
            <p>Need an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    )
}
