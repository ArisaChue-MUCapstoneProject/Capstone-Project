import * as React from "react"
import { useState, useEffect } from "react"
import { Form, Row, Col, Button } from "react-bootstrap" 
import { doc, updateDoc } from "firebase/firestore"
import "bootstrap/dist/css/bootstrap.min.css";

import ProductCard from "../ProductCard/ProductCard"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import "./Pantry.css"

export default function Pantry(props) {
  // get user data from the database
  const { currentUser } = useAuth()
  const userInfo = props.users.find(u => u.uid === currentUser.uid)

  //enum 
  const Operations = Object.freeze({
    Add: Symbol("add"),
    Subtract: Symbol("subtract"),
    Erase: Symbol("erase")
  })

  var basicProductForm = {
    name: "",
    quantity: ""
  }
  const [productForm, setProductForm] = useState(basicProductForm)
  const [userProducts, setUserProducts] = useState(userInfo.data.products)

  // update products state
  useEffect(() => {
    props.setProducts(userProducts)
    // update products in the database
    const docRef = doc(db, "users", currentUser.uid)
    updateDoc(docRef, {products: userProducts})
      .catch(error => {
        //TODO: use proper error handling
        console.log(error)
      })
  }, [userProducts])

  // changes product item quantity based on button click
  const handleProductQuantity = (productName, operation) => {
    let itemIndex = userProducts.findIndex(item => item.name === productName)

    let newProducts = [...userProducts]

    // edit item quantity
    //TODO: throw error if item didn't exist in products
    if (operation === Operations.Add) {
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
      //TODO: use proper error handling
      console.log("no operations match")
    }

    setUserProducts(newProducts)
  }

  // adds new product item when submit button is clicked
  const handleOnSubmitProductForm = () => {
    // submitted info from form
    let itemName = productForm.name.toLowerCase()
    let itemIndex = userProducts.findIndex(item => item.name === itemName)

    let newProducts = [...userProducts]

    // add new item to products
    //TODO: check if productForm.quantity is positive whole number
    if (itemIndex === -1) {
      let newItem = {
        name: itemName,
        quantity: Number(productForm.quantity)
      }
      newProducts.push(newItem)
    } else {
      // if user submitted an item that already exists, just change quantity
      newProducts[itemIndex].quantity += Number(productForm.quantity)
    }

    setUserProducts(newProducts)
    setProductForm(basicProductForm)
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
    {
      userProducts.map((product) => (
        <ProductCard key={product.name} name={product.name} quantity={product.quantity} operations={Operations} handleProductQuantity={handleProductQuantity}/>
      ))
    }
    </div>
  )
}
