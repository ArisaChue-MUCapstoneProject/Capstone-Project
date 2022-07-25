import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { doc, updateDoc } from "firebase/firestore"
import "bootstrap/dist/css/bootstrap.min.css";

import ProductCard from "../ProductCard/ProductCard"
import { useAuth } from "../../contexts/AuthContext"
import { units, basicUnits, convertToStandard, updateStandardAmount, isVolumeUnit } from "../../utils/conversion"
import { db } from "../../firebase"
import "./Pantry.css"

export default function Pantry(props) {
  // get user data from the database
  const { currentUser } = useAuth()

  // operations enum 
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
  const [curUnit, setCurUnit] = useState(basicUnits[0])
  const [isMetric, setIsMetric] = useState(true)
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
      // keep all database quantities to standard
      const unitType = isVolumeUnit(curUnit)
      const quantityAmount = convertToStandard(curUnit, Number(productForm.quantity))
      let newItem = {
        name: itemName,
        quantity: quantityAmount[1],
        unitType: unitType
      }
      newProducts.push(newItem)
      setUserProducts(newProducts)
      setProductForm(basicProductForm)
      setCurUnit(basicUnits[0])
    } else {
      // if user submitted an item that already exists, just change quantity
      const unitType = isVolumeUnit(curUnit)
      if (newProducts[itemIndex].unitType != unitType) {
        setError("please make sure measurement is correct")
      } else {
        const quantityAmount = convertToStandard(curUnit, Number(productForm.quantity))
        newProducts[itemIndex].quantity += quantityAmount[1]
        setUserProducts(newProducts)
      }
      setProductForm(basicProductForm)
      setCurUnit(basicUnits[0])
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

  const handleUnitChange = (event) => {
    setCurUnit(event.target.value)
  }

  return (
    <div className="pantry">
        <h2 className="pantry-heading">Products</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <BootstrapSwitchButton
            checked={isMetric}
            onlabel="Metric"
            onstyle="primary"
            offlabel="Customary"
            offstyle="info"
            width={100}
            onChange={() => {setIsMetric(!isMetric)}}
        />
        <Form className="product-form">
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>Product name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" name="name" value={productForm.name} onChange={handleOnProductFormChange}/>
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group className="mb-3" controlId="formGroupNumber">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="Enter number" name="quantity" value={productForm.quantity} onChange={handleOnProductFormChange}/>
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group className="mb-3" controlId="formGroupNumber">
                <Form.Label>Unit</Form.Label>
                  <Form.Select value={curUnit} onChange={handleUnitChange}>
                    {basicUnits.map((val, ind) => (
                      <option key={val} value={val} disabled={ind == 0} hidden={ind == 0}>{val}</option>
                    ))}
                  </Form.Select>
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
              <ProductCard key={product.name} name={product.name} quantity={product.quantity} unitType={product.unitType} isMetric={isMetric} operations={Operations} handleProductQuantity={handleProductQuantity}/>
            ))
          }
        </div>
        }
    </div>
  )
}
