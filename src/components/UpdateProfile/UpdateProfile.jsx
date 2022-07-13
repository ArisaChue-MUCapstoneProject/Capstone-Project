import * as React from "react"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Card } from "react-bootstrap" 
import { useAuth } from "../../contexts/AuthContext"
import "./UpdateProfile.css"

export default function UpdateProfile() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { updateUserEmail, updateUserPassword, currentUser } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            //TODO: error handling
            console.log("passwords dont match")
        }
        
        // keeps track of tasks to do: update user, pass, or both
        const promises = []
        setLoading(true)

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateUserEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updateUserPassword(passwordRef.current.value))
        }

        Promise.all(promises)
        .then(() => {
            navigate("/profile")
        })
        .catch(() => {
            //TODO: error handling
            console.log("Failed to update account")
        })
        .finally(() => {
            setLoading(false)
        })

    }
    return (
        <div className="update-profile">
            <Card>
            <Card.Body>
                <h2>Update Profile</h2>
                <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}></Form.Control>
                </Form.Group>
                <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same"></Form.Control>
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"></Form.Control>
                </Form.Group>
                <Button disabled={loading} type="submit">Update</Button>
                </Form>
            </Card.Body>
            </Card>
            <p><Link to="/login">Cancel</Link></p>
        </div>
    )
}
