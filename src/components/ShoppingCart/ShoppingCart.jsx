import * as React from "react"
import { useState, useEffect } from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import { doc, updateDoc } from "firebase/firestore"
import "bootstrap/dist/css/bootstrap.min.css";

import ShoppingCartCard from "../ShoppingCartCard/ShoppingCartCard"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./ShoppingCart.css"

export default function ShoppingCart(props) {
  // get user data from the database
  const { currentUser } = useAuth()

  //enum 
  const Operations = Object.freeze({
    Add: Symbol("add"),
    Subtract: Symbol("subtract"),
    Erase: Symbol("erase")
  })

  const basicShoppingForm = {
    name: "",
    quantity: ""
  }
  const [shoppingCartForm, setShoppingCartForm] = useState(basicShoppingForm)
  const [userCart, setUserCart] = useState([])
  const [error, setError] = useState("")

  // update user data once page loads
  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.cart && setUserCart(userInfo.data.cart)
    }
  }, [props.isLoading])
  

  // update carts state
  useEffect(() => {
    // update carts in the database
    if (!props.isLoading && userCart) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, { cart: userCart })
        .catch(error => {
          setError(error.message)
      })
    }
  }, [userCart])

  function clearError() {
    setError("")
  }

  // changes shopping cart item quantity based on button click
  const handleCartQuantity = (itemName, operation) => {
    let itemIndex = userCart.findIndex(item => item.name === itemName)
    let newCart = [...userCart]
    clearError()

    // edit item quantity
    if (itemIndex === -1) {
      setError("item does not exist in your cart")
    }
    else if (operation === Operations.Add) {
      newCart[itemIndex].quantity += 1
    } 
    else if (operation === Operations.Subtract) {
      newCart[itemIndex].quantity -= 1
      if (newCart[itemIndex].quantity == 0) {
        newCart.splice(itemIndex, 1)
      }
    } else if (operation === Operations.Erase) {
      newCart.splice(itemIndex, 1)
    } else {
      setError("action could not be executed because operation does not exist")
    }

    setUserCart(newCart)
  }

  // adds new shopping cart item when submit button is clicked
  const handleOnSubmitCartForm = () => {
    // submitted info from form
    let itemName = shoppingCartForm.name.toLowerCase()
    let itemIndex = userCart.findIndex(item => item.name === itemName)

    let newCart = [...userCart]
    clearError()
    // add new item to cart
    if (shoppingCartForm.quantity < 1) {
      setError("Quantity must be positive whole number")
    }
    else if (itemIndex === -1) {
      let newItem = {
        name: itemName,
        quantity: Number(shoppingCartForm.quantity)
      }
      newCart.push(newItem)
      setShoppingCartForm(basicShoppingForm)
      setUserCart(newCart)
      
    } else {
      // if user submitted an item that already exists, just change quantity
      newCart[itemIndex].quantity += Number(shoppingCartForm.quantity)
      setShoppingCartForm(basicShoppingForm)
      setUserCart(newCart)
      
    }
  }

  // when the inputs of products form changes
  const handleOnCartFormChange = (event) => {
    let key = event.target.name
    let val = event.target.value
    // deep copy of product form
    let newShoppingCartForm = {
      name: shoppingCartForm.name,
      quantity: shoppingCartForm.quantity
    }
    // update with the change (either item name or quantity)
    newShoppingCartForm[key] = val
    setShoppingCartForm(newShoppingCartForm)
  }

  return (
    <div className="shopping-cart">
        <h2 className="cart-heading">Shopping Cart List</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form className="cart-form">
          <Row>
            <Col xs={7}>
              <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>Item name</Form.Label>
                <Form.Control type="text" placeholder="Enter item name" name="name" value={shoppingCartForm.name} onChange={handleOnCartFormChange}/>
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group className="mb-3" controlId="formGroupNumber">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="Enter item quantity" name="quantity" value={shoppingCartForm.quantity} onChange={handleOnCartFormChange}/>
              </Form.Group>
            </Col>
            <Col className="cart-submit">
              <Button variant="primary" onClick={handleOnSubmitCartForm}>Submit</Button>
            </Col>
          </Row>
        </Form>
        {userCart &&
        <div>
          {
            userCart.map((cart) => (
              <ShoppingCartCard key={cart.name} name={cart.name} quantity={cart.quantity} operations={Operations} handleCartQuantity={handleCartQuantity}/>
            ))
          }
        </div>
        }
    </div>
  )
}
