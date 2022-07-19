import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import { doc, updateDoc } from "firebase/firestore"
import "bootstrap/dist/css/bootstrap.min.css";

import ProductCard from "../ProductCard/ProductCard"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./Pantry.css"

export default function Pantry(props) {
  // get user data from the database
  const { currentUser } = useAuth()

  //enum 
  const Operations = Object.freeze({
    Add: Symbol("add"),
    Subtract: Symbol("subtract"),
    Erase: Symbol("erase")
  })

  const basicProductForm = {
    name: "",
    quantity: ""
  }
  const [productForm, setProductForm] = useState(basicProductForm)
  const [userProducts, setUserProducts] = useState([])
  const [error, setError] = useState("")

  // update user data once page loads
  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.products && setUserProducts(userInfo.data.products)
    }
  }, [props.isLoading])
  

  // update products state
  useEffect(() => {
    // update products in the database
    if (!props.isLoading && userProducts) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, {products: userProducts})
        .catch(error => {
          setError(error.message)
      })
    }
  }, [userProducts])

  function clearError() {
    setError("")
  }

  // changes product item quantity based on button click
  const handleProductQuantity = (productName, operation) => {
    let itemIndex = userProducts.findIndex(item => item.name === productName)
    let newProducts = [...userProducts]
    clearError()

    // edit item quantity
    if (itemIndex === -1) {
      setError("item does not exist in your products")
    }
    else if (operation === Operations.Add) {
      newProducts[itemIndex].quantity += 1
    } 
    else if (operation === Operations.Subtract) {
      newProducts[itemIndex].quantity -= 1
      if (newProducts[itemIndex].quantity == 0) {
        newProducts.splice(itemIndex, 1)
      }
    } else if (operation === Operations.Erase) {
      newProducts.splice(itemIndex, 1)
    } else {
      setError("action could not be executed because operation does not exist")
    }

    setUserProducts(newProducts)
  }

  // adds new product item when submit button is clicked
  const handleOnSubmitProductForm = () => {
    // submitted info from form
    let itemName = productForm.name.toLowerCase()
    let itemIndex = userProducts.findIndex(item => item.name === itemName)

    let newProducts = [...userProducts]
    clearError()
    // add new item to products
    if (productForm.quantity < 1) {
      setError("Quantity must be positive whole number")
    }
    else if (itemIndex === -1) {
      let newItem = {
        name: itemName,
        quantity: Number(productForm.quantity)
      }
      newProducts.push(newItem)
      setProductForm(basicProductForm)
      setUserProducts(newProducts)
      
    } else {
      // if user submitted an item that already exists, just change quantity
      newProducts[itemIndex].quantity += Number(productForm.quantity)
      setProductForm(basicProductForm)
      setUserProducts(newProducts)
      
    }
  }

  // when the inputs of products form changes
  const handleOnProductFormChange = (event) => {
    let key = event.target.name
    let val = event.target.value
    // deep copy of product form
    let newProductForm = {
      name: productForm.name,
      quantity: productForm.quantity
    }
    // update with the change (either item name or quantity)
    newProductForm[key] = val
    setProductForm(newProductForm)
  }

  return (
    <div className="pantry">
        <h2 className="pantry-heading">Products</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form className="product-form">
          <Row>
            <Col xs={7}>
              <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>Product name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" name="name" value={productForm.name} onChange={handleOnProductFormChange}/>
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group className="mb-3" controlId="formGroupNumber">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="Enter number" name="quantity" value={productForm.quantity} onChange={handleOnProductFormChange}/>
              </Form.Group>
            </Col>
            <Col className="product-submit">
              <Button variant="primary" onClick={handleOnSubmitProductForm}>Submit</Button>
            </Col>
          </Row>
        </Form>
        {userProducts &&
        <div>
          {
            userProducts.map((product) => (
              <ProductCard key={product.name} name={product.name} quantity={product.quantity} operations={Operations} handleProductQuantity={handleProductQuantity}/>
            ))
          }
        </div>
        }
    </div>
  )
}
